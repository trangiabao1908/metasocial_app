import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import ImageCustom from "../custom/imageCustom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useLayoutEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/config";
import { updatedUserApi } from "../../api/userApi";
import { updatedUser } from "../../redux/user";
import { EventRegister } from "react-native-event-listeners";

const EditPer = ({ navigation }) => {
  const user = useSelector((state) => state?.userState?.user);

  const [avatar, setAvatar] = useState(user?.picturePath);
  const [username, setUsername] = useState(user?.username);
  const [displayName, setDisplayName] = useState(user?.displayName);
  const [story, setStory] = useState(user?.story);
  const [link, setLink] = useState(user?.link);
  const [select, setSelect] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigation();

  useLayoutEffect(() => {
    navigate.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSubmit} disabled={disableButton}>
          <View
            style={{ paddingHorizontal: 5, opacity: disableButton ? 0.1 : 1 }}
          >
            <Icon name="edit" size={25} />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigate, select, username, link, story, displayName, disableButton]);

  const handleSubmit = async () => {
    try {
      setDisableButton(true);
      let url = "";
      if (select) {
        const imageURL = await uploadImage(select);
        url = imageURL.url;
      } else {
        url = avatar;
      }
      console.log(url);
      const req = await updatedUserApi(
        { username, displayName, story, link },
        url
      );
      if (req?.success) {
        console.log("success");
        let userUpdate = {
          username: req.user.username,
          picturePath: req.user.picturePath,
          displayName: req.user.displayName,
          story: req.user.story,
          link: req.user.link,
        };
        dispatch(updatedUser(userUpdate));
        EventRegister.emit("onSuccessUpdatedUser");
        navigate.navigate("Personal", { type: "personal" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
        allowsEditing: true,
      });

      if (!result.canceled) {
        let data = [];

        data.push({
          type: result.assets[0].type,
          fileName: result.assets[0].fileName,
          uri:
            Platform.OS === "ios"
              ? result.assets[0].uri.replace("file://", "")
              : result.assets[0].uri,
        });
        setAvatar(data[0].uri);
        setSelect(data[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleChangeTextUsername = (text) => {
    setUsername(text);
  };
  const handleChangeTextDisplayName = (text) => {
    setDisplayName(text);
  };
  const handleChangeTextStory = (text) => {
    setStory(text);
  };
  const handleChangeTextLink = (text) => {
    setLink(text);
  };

  async function uploadImage(select) {
    try {
      const response = await fetch(select);
      const blob = await response.blob();
      const nameFolder = `${user._id}/avatar/image/`;

      const nameFile = new Date().getTime();

      const storageRef = ref(storage, nameFolder + nameFile);
      const upload = await uploadBytesResumable(storageRef, blob);
      const downloadURLs = await getDownloadURL(upload.ref);

      return {
        url: downloadURLs,
        type: "image",
      };
    } catch (error) {
      console.log(error);
    }
  }
  const handleChangePassword = () => {
    navigation.navigate("ChangePassword");
  };
  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <View style={styles.avatar}>
          <ImageCustom
            style={{ width: 80, height: 80 }}
            resizeMode="cover"
            source={{ uri: avatar }}
            type="avatar"
          />
        </View>
        <TouchableOpacity onPress={pickImage}>
          <View>
            <Text style={styles.editAvatar}>Chỉnh sửa ảnh hoặc avatar</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.editView}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.fontSize_16}>Tên người dùng</Text>
          </View>
          <View
            style={{
              flex: 3,
              borderBottomColor: "#EAEAEA",
              borderBottomWidth: 1,
              paddingVertical: 10,
              //   backgroundColor: "red",
            }}
          >
            <TextInput
              placeholder="Nhập tên"
              onChangeText={(text) => handleChangeTextUsername(text)}
              value={username}
              style={[styles.fontSize_16, styles.fontBold]}
            />
          </View>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.fontSize_16}>Danh xưng</Text>
          </View>
          <View
            style={{
              flex: 3,
              borderBottomColor: "#EAEAEA",
              borderBottomWidth: 1,
              paddingVertical: 10,
            }}
          >
            <TextInput
              placeholder="Mời bạn nhập danh xưng..."
              onChangeText={(text) => handleChangeTextDisplayName(text)}
              value={displayName}
              style={[styles.fontSize_16, styles.fontBold]}
            />
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.fontSize_16}>Tiểu sử</Text>
          </View>
          <View
            style={{
              flex: 3,
              borderBottomColor: "#EAEAEA",
              borderBottomWidth: 1,
              paddingVertical: 10,
            }}
          >
            <TextInput
              placeholder="Mời bạn nhập tiểu sử..."
              value={story}
              style={[styles.fontSize_16, styles.fontBold]}
              onChangeText={(text) => handleChangeTextStory(text)}
            />
          </View>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.fontSize_16}>Liên kết</Text>
          </View>
          <View
            style={{
              flex: 3,
              borderBottomColor: "#EAEAEA",
              paddingVertical: 10,
            }}
          >
            <TextInput
              placeholder="Mời bạn nhập liên kết..."
              value={link}
              style={[styles.fontSize_16, styles.fontBold]}
              onChangeText={(text) => handleChangeTextLink(text)}
            />
          </View>
        </View>
      </View>

      <View style={{ borderBottomWidth: 1, borderBottomColor: "#EAEAEA" }}>
        <View
          style={{
            borderBottomColor: "#EAEAEA",
            paddingVertical: 10,
            marginLeft: 15,
          }}
        >
          <Text style={[styles.fontSize_16, { color: "blue" }]}>
            Chuyển sang tài khoản công việc
          </Text>
        </View>
      </View>
      <View style={{ borderBottomWidth: 1, borderBottomColor: "#EAEAEA" }}>
        <View
          style={{
            borderBottomColor: "#EAEAEA",
            paddingVertical: 10,
            marginLeft: 15,
          }}
        >
          <Text style={[styles.fontSize_16, { color: "blue" }]}>
            Cài đặt thông tin cá nhân
          </Text>
        </View>
      </View>
      <View>
        <View
          style={{
            borderBottomColor: "#EAEAEA",
            paddingVertical: 10,
            marginLeft: 15,
          }}
        >
          <Text style={[styles.fontSize_16, { color: "blue" }]}>
            Đăng ký dịch vụ Meta xác minh
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleChangePassword}>
        <View>
          <View
            style={{
              borderBottomColor: "#EAEAEA",
              paddingVertical: 10,
              marginLeft: 15,
            }}
          >
            <Text style={[styles.fontSize_16, { color: "blue" }]}>
              Đổi mật khẩu
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
    //   )}
    // </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  topView: {
    marginTop: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    borderWidth: 1,
    borderRadius: 360,
    borderColor: "#EAEAEA",
    width: 100,
    height: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  editAvatar: {
    marginVertical: 15,
    color: "blue",
    fontSize: 15,
  },

  editView: {
    borderWidth: 1,
    borderColor: "#EAEAEA",
    // backgroundColor: "red",
  },
  fontSize_16: {
    fontSize: 16,
  },
  fontBold: {
    fontWeight: "bold",
  },
});

export default EditPer;
