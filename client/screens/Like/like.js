import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { getLikeListApi } from "../../api/postApi";
import CustomButton from "../../components/custom/button";
import ImageCustom from "../../components/custom/imageCustom";
import { useSelector } from "react-redux";

const LikeScreen = ({ navigation }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const friends = useSelector((state) => state?.userState?.user?.friends);
  const route = useRoute();
  const userLoggedId = useSelector((state) => state?.userState?.user?._id);
  useEffect(() => {
    getLikeList();
  }, []);

  const getLikeList = async () => {
    setLoading(true);
    let postID = route?.params?.id;
    const req = await getLikeListApi(postID);
    if (req.status) {
      setList(req.list);
      setLoading(false);
    }
  };

  const renderLikeList = ({ item }) => {
    const isFriend = friends?.find((friend) => friend._id === item?.user?._id);
    const isUserLogged = item?.user?._id === userLoggedId;
    return (
      <View
        key={item._id}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 10,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 20,
            width: "65%",
          }}
        >
          <TouchableOpacity
          // onPress={() => handleGoToPerScreen(item._id.toString())}
          >
            <ImageCustom
              resizeMode="cover"
              style={{ width: 45, height: 45 }}
              type={"avatar"}
              source={{
                uri: item.user.picturePath,
              }}
            />
          </TouchableOpacity>

          <View
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: 5,
              flexWrap: "wrap",
            }}
          >
            <View
              style={{
                marginLeft: 5,
                marginBottom: 2,
              }}
            >
              <Text style={{ fontWeight: "bold", marginBottom: 1 }}>
                {item.user?.username}
              </Text>
              {item?.user?.displayName && (
                <Text style={{ fontWeight: 400, color: "grey" }}>
                  {item?.user?.displayName}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View
          style={{
            display: "flex",
            justifyContent: "center",
            marginRight: 20,
          }}
        >
          {!isUserLogged ? (
            <CustomButton
              title={isFriend ? "Bạn bè" : "Thêm bạn bè"}
              style={{ backgroundColor: "#00D5FA", borderRadius: 12 }}
              styleText={{
                paddingHorizontal: 4,
                paddingVertical: 2,
                color: "white",
                fontWeight: "500",
              }}
            />
          ) : (
            <></>
          )}
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.search}>
          <View style={styles.wrapIcon}>
            <Icon name="search1" size={20} color="black" />
          </View>
          <TextInput placeholder="Tìm kiếm...." style={styles.input} />
        </View>
      </View>
      {!loading ? (
        <FlatList data={list} renderItem={renderLikeList} />
      ) : (
        <ActivityIndicator size={"small"} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  searchContainer: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#e0e0e0",
    marginBottom: 5,
  },
  search: {
    marginHorizontal: 10,
    flex: 1,
    backgroundColor: "rgb(239, 239, 239)",
    display: "flex",
    flexDirection: "row",
    borderRadius: 10,
    paddingHorizontal: 20,
  },

  input: {
    flex: 1,
    height: 35,
    borderRadius: 8,
  },

  wrapIcon: {
    display: "flex",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  btnCancel: {
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    paddingHorizontal: 5,
    // backgroundColor: "red",
  },
});

export default LikeScreen;
