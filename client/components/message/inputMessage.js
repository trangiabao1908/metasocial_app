import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import EmojiSelector from "react-native-emoji-selector";
import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/Feather";
import Icon4 from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import { sendMessage } from "../../api/userApi";
import { storage } from "../../firebase/config";
import { useToast } from "react-native-toast-notifications";

const InputMessage = ({
  selectedUserId,
  setMessages,
  setPreMessageImage,
  setLoadingImage,
  flatListRef,
}) => {
  const toast = useToast();
  const userLoggedId = useSelector((state) => state?.userState?.user?._id);
  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(true);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const data = {
        assetId: result.assets[0].assetId,
        type: result.assets[0].type,
        name: result.assets[0].fileName,
        uri:
          Platform.OS === "ios"
            ? result.assets[0].uri.replace("file://", "")
            : result.assets[0].uri,
      };
      setPreMessageImage(result.assets[0].uri);
      setLoadingImage(true);
      handleSendMessage("image", data);
    }
  };
  const handleSendMessage = async (messageType, dataImage) => {
    let values;
    let storageRef;
    setSendingMessage(false);
    if (messageType === "image") {
      const response = await fetch(dataImage.uri);
      const blob = await response.blob();
      const nameFolder =
        dataImage.type === "image"
          ? `/${userLoggedId}/messages/assets/image/`
          : "";
      if (dataImage.name != null) {
        const nameFile =
          dataImage.name.substring(0, dataImage.name.lastIndexOf(".")) +
          new Date().getTime();
        storageRef = ref(storage, nameFolder + nameFile);
      } else {
        const currentTime = new Date().getTime();
        storageRef = ref(storage, nameFolder + currentTime);
      }

      const upload = await uploadBytesResumable(storageRef, blob);
      const downloadURLs = await getDownloadURL(upload.ref);
      values = {
        senderId: userLoggedId,
        receiverId: selectedUserId,
        messageType,
        imageUrl: downloadURLs,
      };
    } else {
      values = {
        senderId: userLoggedId,
        receiverId: selectedUserId,
        messageType,
        message,
      };
    }
    if (values) {
      const res = await sendMessage(values);
      if (res && res.success) {
        setMessage("");
        setLoadingImage(false);
        setMessages((preMessages) => [...preMessages, res.newMessage]);
        setPreMessageImage(null);
        setShowEmoji(false);
        setSendingMessage(true);
        flatListRef?.current
          ? setTimeout(() => {
              flatListRef.current.scrollToEnd({ animated: false });
            }, 100)
          : {};
      }
    }
  };
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === "granted";
  };
  const takePicture = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        const data = {
          type: result.assets[0].type,
          name: result.assets[0].fileName,
          uri:
            Platform.OS === "ios"
              ? result.assets[0].uri.replace("file://", "")
              : result.assets[0].uri,
        };
        setLoadingImage(true);
        setPreMessageImage(result.assets[0].uri);
        handleSendMessage("image", data);
      }
    }
  };

  return (
    <View style={styles.footer}>
      <View style={styles.wrapTextInput}>
        <View style={[styles.wrapIcon, styles.firstIcon]}>
          <TouchableOpacity onPress={takePicture}>
            <Icon
              name="camera"
              size={25}
              color="white"
              style={{ borderRadius: 360 }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.input}>
          <TextInput
            placeholder="Nhắn tin..."
            multiline={true}
            value={message}
            onChangeText={setMessage}
          />
        </View>
        {message ? (
          <>
            <View style={styles.wrapIcon}>
              <TouchableOpacity onPress={() => setShowEmoji(!showEmoji)}>
                <Icon4 name="sticker-emoji" size={30} color="black" />
              </TouchableOpacity>
            </View>
            <Pressable
              onPress={() => {
                sendingMessage ? handleSendMessage("text") : {};
              }}
              style={[styles.wrapIcon, { marginRight: 10 }]}
            >
              <Icon2 name="send" size={30} color="black" />
            </Pressable>
          </>
        ) : (
          <>
            <View style={styles.wrapIcon}>
              <Icon4 name="microphone-outline" size={30} color="black" />
            </View>
            <View style={styles.wrapIcon}>
              <TouchableOpacity onPress={pickImage}>
                <Icon2 name="image" size={30} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.wrapIcon}>
              <TouchableOpacity onPress={() => setShowEmoji(!showEmoji)}>
                <Icon4 name="sticker-emoji" size={30} color="black" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      {showEmoji && (
        <>
          <EmojiSelector
            onEmojiSelected={(emoji) => {
              setMessage((preMessage) => preMessage + emoji);
            }}
            placeholder="Search emoji..."
            style={{ height: 250 }}
          ></EmojiSelector>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Platform.OS === "ios" ? 15 : 30,
    // marginBottom: 30,
  },
  wrapTextInput: {
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: "rgb(239, 239, 239)",
    display: "flex",
    flexDirection: "row",
    borderRadius: 24,
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  input: {
    flex: 5,
  },
  firstIcon: {
    // flex: 1,
    backgroundColor: "blue",
    borderRadius: 360,
    display: "flex",
    alignItems: "center",
    marginRight: 10,
  },

  wrapIcon: {
    height: 45,
    display: "flex",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
});

export default InputMessage;
