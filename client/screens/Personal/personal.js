import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useLayoutEffect, useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import Icon from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import { getPostByUserIdApi } from "../../api/postApi";
import {
  acceptFriendRequestAPI,
  getChatIdAPI,
  getRequestFriendAPI,
  getSentFriendRequestAPI,
  sendRequestFriend,
} from "../../api/userApi";
import CustomButton from "../../components/custom/button";
import ImageCustom from "../../components/custom/imageCustom";
import LeftHeader from "../../components/custom/leftHeader";
import RightHeader from "../../components/custom/rightHeader";
import Footer from "../../components/footer";
import Paper from "../../components/personal/paper";
import { setFriends } from "../../redux/user";

const Personal = ({}) => {
  const route = useRoute();
  const type = route.params?.type;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userID = useSelector((state) => state?.userState?.user?._id);
  const [dataPersonal, setDataPersonal] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const [title, setTitle] = useState("Thêm bạn bè");
  const [friendsRequest, setFriendsRequest] = useState([]);

  useLayoutEffect(() => {
    if (type === "viewProfile") {
      navigation.setOptions({
        headerLeft: () => <LeftHeader screen="viewProfile" />,
        headerRight: () => <RightHeader screen="viewProfile" />,
        headerTitleAlign: "center",
        title: user && user?.username,
      });
    }
  }, [navigation, type, user]);

  useEffect(() => {
    if (route.params?.authorID === userID) {
      setIsAuthor(true);
    }
    if (type) {
      getDataPersonal();
      console.log("call again");
      const eventListener = () => {
        EventRegister.addEventListener("onSuccessUpdatedUser", getDataPersonal);
      };
      eventListener();
      return () => {
        EventRegister.removeEventListener(
          "onSuccessUpdatedUser",
          getDataPersonal
        );
      };
    }
  }, [type]);
  const getFriendsRequest = async () => {
    const res = await getRequestFriendAPI(userID);
    if (res && res.success) {
      setFriendsRequest(res.friendRequests);
    }
  };

  useEffect(() => {
    const getSentFriend = async () => {
      const res = await getSentFriendRequestAPI(userID);
      if (res && res?.success) {
        res?.data?.filter((item) =>
          item._id === route?.params?.authorID
            ? setTitle("Hủy thêm bạn bè")
            : setTitle("Thêm bạn bè")
        );
      }
    };
    getSentFriend();
    getFriendsRequest();
  }, []);
  const getDataPersonal = async () => {
    let id = "";
    if (type === "viewProfile") {
      id = route.params?.authorID;
    } else {
      id = userID;
    }

    const req = await getPostByUserIdApi(id, type);
    if (req && req?.success) {
      setDataPersonal(req.data);
      setUser(req.user);
    }
  };

  const friends = useSelector((state) => state?.userState?.user?.friends);
  const isFriend = friends?.find(
    (friend) => friend._id === route?.params?.authorID
  );

  const isNeedAccept = friendsRequest?.find(
    (friend) => friend._id === route?.params?.authorID
  );

  const handleAcceptFriend = async (needAcceptedId) => {
    const res = await acceptFriendRequestAPI(needAcceptedId);
    if (res && res.success) {
      Alert.alert(res.message);
      dispatch(setFriends(res.data));
    }
  };
  const handleGetChatID = async () => {
    let chatId;
    const res = await getChatIdAPI(route?.params?.authorID);
    if (res && res.success) {
      chatId = res.chatId;
    }
    return chatId;
  };
  const handleNavigateToMessageScreen = async (item) => {
    // const chatId = await handleGetChatID();
    const values = {
      userInfo: {
        _id: item._id,
        username: item.username,
        picturePath: item.picturePath,
        email: item.email,
      },
      // chatId,
    };
    navigation.navigate("Message", { data: values });
  };
  const handleSendRequestFriend = async (selectedUserId) => {
    const res = await sendRequestFriend(selectedUserId);
    if (res && res?.success) {
      Alert.alert(res.message);
      res?.type === "remove"
        ? setTitle("Thêm bạn bè")
        : setTitle("Hủy thêm bạn bè");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content]}>
        <View style={[styles.wrapper, styles.mt_10]}>
          <View style={styles.flexRow}>
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                flex: 1,
                marginBottom: 0,
              }}
            >
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 360,
                  width: 85,
                  height: 85,
                  marginBottom: 7,
                }}
              >
                <ImageCustom
                  style={{ width: 85, height: 85 }}
                  resizeMode="cover"
                  type={"avatar"}
                  source={{ uri: user?.picturePath }}
                />
              </View>
            </View>

            <View
              style={[
                styles.flexRow,
                { flex: 2, justifyContent: "space-around" },
              ]}
            >
              <View style={styles.flexColumn}>
                <Text style={styles.fontSize16}>{dataPersonal?.length}</Text>
                <Text>Bài viết</Text>
              </View>

              <View style={styles.flexColumn}>
                <Text style={styles.fontSize16}>{user?.followers || 0}</Text>
                <Text style={styles.fontSize10}>Người theo dõi</Text>
              </View>
              <View style={styles.flexColumn}>
                <Text style={styles.fontSize16}>
                  {user?.friends?.length || 0}
                </Text>
                <Text style={styles.fontSize10}>Bạn bè</Text>
              </View>
            </View>
          </View>

          <View style={[styles.flexRow]}>
            <View>
              <Text
                style={[
                  {
                    fontWeight: "500",
                    marginBottom: 5,
                    marginRight: 3,
                    fontSize: 14,
                  },
                ]}
              >
                {user?.username}
              </Text>
            </View>

            <View>
              <Text style={[styles.name]}>_ {user?.displayName} _</Text>
            </View>
          </View>
          {user?.story && (
            <View style={styles.flexRow}>
              <Text style={[{ width: "100%" }]}>{user?.story}</Text>
            </View>
          )}
          {user?.link && (
            <View
              style={[
                styles.flexRow,
                { alignItems: "center", marginVertical: 5 },
              ]}
            >
              <Icon name="link" />
              <Text style={[{ width: "100%", marginLeft: 5 }, styles.link]}>
                {user?.link}
              </Text>
            </View>
          )}
          <View style={[styles.flexRow, styles.mt_10]}>
            <View style={[styles.button, { marginRight: 5 }]}>
              {type === "viewProfile" && !isAuthor ? (
                <CustomButton
                  title={
                    isFriend ? "Bạn bè" : isNeedAccept ? "Xác nhận" : title
                  }
                  styleText={{ fontWeight: "500" }}
                  onPress={() => {
                    isFriend
                      ? console.log("Friend")
                      : isNeedAccept
                      ? handleAcceptFriend(route?.params?.authorID)
                      : handleSendRequestFriend(route?.params?.authorID);
                  }}
                />
              ) : (
                <CustomButton
                  title={"Chỉnh sửa"}
                  styleText={{ fontWeight: "500" }}
                  onPress={() => navigation.navigate("EditPersonal")}
                />
              )}
            </View>
            <View style={[styles.button, { marginLeft: 5 }]}>
              {type === "viewProfile" && !isAuthor ? (
                <CustomButton
                  title={"Nhắn tin"}
                  onPress={() => handleNavigateToMessageScreen(user)}
                  styleText={{ fontWeight: "500" }}
                />
              ) : (
                <CustomButton
                  title={"Chia sẻ trang cá nhân"}
                  styleText={{ fontWeight: "500" }}
                />
              )}
            </View>
          </View>
        </View>

        <View style={[styles.flexRow, { marginTop: 20 }]}>
          {/* <FlatList
            data={listYourStories}
            renderItem={renderItems}
            keyExtractor={(item) => item.id}
            initialNumToRender={1}
            horizontal
            showsHorizontalScrollIndicator={false}
          /> */}

          <View style={[styles.flexItem, { marginRight: 15 }]}>
            <View style={styles.content2}>
              <Icon name="plus" size={25} />
            </View>
            <Text
              style={[
                styles.textCenter,
                { width: 60, fontSize: 12, marginTop: 5 },
              ]}
            >
              Mới
            </Text>
          </View>
        </View>

        <Paper dataPersonal={dataPersonal} />
      </View>
      {type === "personal" && (
        <View style={styles.footer}>
          <Footer navigation={navigation} isActive={4} />
        </View>
      )}
      {type === "viewProfile" && isAuthor && (
        <View style={styles.footer}>
          <Footer navigation={navigation} isActive={4} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "white",
    flex: 1,
  },

  content: {
    flex: 1,
    marginTop: 5,
  },
  wrapper: {
    marginHorizontal: 15,
    marginTop: 10,
    // backgroundColor: "blue",
  },
  mt_10: {
    marginTop: 10,
  },

  flexRow: {
    display: "flex",
    flexDirection: "row",
  },
  flexColumn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  textCenter: {
    textAlign: "center",
  },

  fontSize10: {
    fontSize: 12,
  },
  fontSize16: {
    fontSize: 15,
  },
  button: {
    flex: 1,
  },

  content2: {
    display: "flex",
    justifyContent: "center",
    height: 50,
    width: 50,
    alignItems: "center",
    borderRadius: 360,
    borderColor: "#E5E5E5",
    borderWidth: 1,
  },
  flexItem: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "blue",
  },
  name: {
    fontSize: 14,
    color: "grey",
    opacity: 0.8,
  },
  link: {
    color: "rgb(0, 55, 107)", // Màu chữ của link
    fontWeight: "bold",
  },

  footer: {
    borderTopColor: "rgb(219, 219, 219)",
    borderTopWidth: 0.5,
  },
});

export default Personal;
