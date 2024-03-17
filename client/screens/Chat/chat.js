import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import ImageCustom from "../../components/custom/imageCustom";
import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/Feather";
import { useSelector, useDispatch } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import { fetchChatApi, getFriends } from "../../api/userApi";
import { setFriends } from "../../redux/user";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
const Chat = ({ navigation }) => {
  const handleNavigate = (item) => {
    navigation.navigate("Message", { data: item });
  };
  const dispatch = useDispatch();
  const [chatUser, setChatUser] = useState([]);
  useEffect(() => {
    console.log("Chat screens");
    const fetchChat = async () => {
      const res = await fetchChatApi();
      if (res && res.success) {
        setChatUser(res.chatInfo);
      }
    };
    // const getUserFriends = async () => {
    //   const res = await getFriends();
    //   if (res && res.success) {
    //     dispatch(setFriends(res.friends));
    //   }
    // };
    fetchChat();
    // getUserFriends();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      const fetchChat = async () => {
        const res = await fetchChatApi();
        if (res && res.success) {
          setChatUser(res.chatInfo);
        }
      };
      fetchChat();
    }, [])
  );
  const userFriends = useSelector((state) => state?.userState?.user?.friends);
  const userLoggedId = useSelector((state) => state?.userState?.user?._id);
  const renderItems = ({ item }) => {
    return (
      <Fragment>
        <View style={{ marginLeft: 20 }} key={item?._id}>
          <View style={styles.flexItem}>
            <View style={styles.content2}>
              <ImageCustom
                style={{ width: 50, height: 50 }}
                resizeMode="cover"
                source={{ uri: item?.picturePath }}
                type="avatar"
              />
            </View>
            <Text
              style={[
                styles.textCenter,
                { width: "100%", fontSize: 12, marginTop: 5 },
              ]}
            >
              {item.username}
            </Text>
          </View>
        </View>
      </Fragment>
    );
  };
  const renderChatUser = ({ item }) => {
    const { userInfo, lastMessage } = item;
    let messageFormatted = lastMessage.lastMessageFormatted;
    const isSender = lastMessage.senderId === userLoggedId;
    let messageDisplay;
    const maxMessageLength = 15;
    if (messageFormatted?.length > maxMessageLength) {
      messageFormatted =
        messageFormatted.substring(0, maxMessageLength) + "...";
    }
    if (messageFormatted?.startsWith("https://")) {
      messageDisplay = isSender
        ? "Bạn: Đã gửi một hình ảnh"
        : "Đã gửi một hình ảnh";
    } else {
      messageDisplay = isSender
        ? `Bạn: ${messageFormatted}`
        : messageFormatted || "Bắt đầu cuộc trò chuyện mới";
    }
    return (
      <Fragment>
        <TouchableOpacity
          onPress={() => handleNavigate(item)}
          key={userInfo?._id}
        >
          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 8,
            }}
          >
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <ImageCustom
                style={{ width: 50, height: 50, marginRight: 10 }}
                resizeMode="cover"
                source={{ uri: userInfo.picturePath }}
                type="avatar"
              />
              <View style={{ maxWidth: 230 }}>
                <Text style={{ fontSize: 16 }}>{userInfo?.username}</Text>
                <Text
                  style={[
                    {
                      color: "rgb(115, 115, 115)",
                      fontWeight: 500,
                      fontSize: 13,
                      marginTop: 5,
                    },
                  ]}
                >
                  {messageDisplay}
                </Text>
              </View>
            </View>
            <Icon2 name="camera" size={23} />
          </View>
        </TouchableOpacity>
      </Fragment>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={false}
        bounces={true}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        <View>
          <View style={styles.search}>
            <View style={styles.wrapIcon}>
              <Icon name="search1" size={20} color="black" />
            </View>
            <TextInput style={styles.input} placeholder="Tìm kiếm...." />
          </View>

          <View>
            <FlatList
              data={userFriends}
              renderItem={renderItems}
              // keyExtractor={(item) => item._id}
              initialNumToRender={1}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <View style={{ marginHorizontal: 20, marginTop: 20 }}>
            <View
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Text style={[styles.fontSize16, { fontWeight: 700 }]}>
                Tin nhắn
              </Text>
              <Text
                style={[
                  styles.fontSize14,
                  { color: "rgb(115, 115, 115)", fontWeight: 600 },
                ]}
              >
                Tin nhắn đang chờ
              </Text>
            </View>
          </View>
          <View
            style={{
              marginHorizontal: 20,
              marginVertical: 10,
              // backgroundColor: "blue",
            }}
          >
            <FlatList
              renderItem={renderChatUser}
              data={chatUser}
              // keyExtractor={(item) => item._id}
              scrollEnabled={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  search: {
    marginTop: 10,
    marginHorizontal: 20,
    backgroundColor: "rgb(239, 239, 239)",
    display: "flex",
    flexDirection: "row",
    borderRadius: 10,
    marginBottom: 20,
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
  textCenter: {
    textAlign: "center",
    // backgroundColor: "red",
  },

  content2: {
    display: "flex",
    justifyContent: "center",
    height: 60,
    width: 60,
    alignItems: "center",
    borderRadius: 360,
    borderColor: "#E5E5E5",
    borderWidth: 1,
    // backgroundColor: "blue",
  },
  flexItem: {
    display: "flex",
    justifyContent: "center",

    // backgroundColor: "blue",
  },
  fontSize16: {
    fontSize: 16,
  },
  fontSize14: {
    fontSize: 14,
  },
});

export default Chat;
