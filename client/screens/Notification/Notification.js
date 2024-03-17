import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import ImageCustom from "../../components/custom/imageCustom";
import socket from "../../utils/configSocket";
import { getNotificationApi } from "../../api/noticeApi";
import { formatTime } from "../../utils/setTime";
import { getPostByUserIdApi } from "../../api/postApi";
import { useNavigation } from "@react-navigation/native";

const Notification = () => {
  const [noticesToday, setNoticesToday] = useState([]);
  const [noticesIn7Days, setNoticesIn7Days] = useState([]);
  const [noticesIn30Days, setNoticesIn30Days] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    socket.on("notification", (data) => {
      getNotification();
    });
  }, []);
  useEffect(() => {
    getNotification();
  }, []);
  const getNotification = async () => {
    const req = await getNotificationApi();
    if (req) {
      setNoticesIn7Days(req.noticesIn7Days.reverse());
      setNoticesIn30Days(req.noticesIn30Days.reverse());
      setNoticesToday(req.noticesToday.reverse());
    }
  };

  const renderNotifications = (item) => {
    let inputString = item.content.split(" ");
    let username = inputString[0];
    let content = inputString.slice(1).join(" ");

    const getDataPost = async () => {
      let type = "viewProfile";
      let id = item.post?.author;

      if (id) {
        const req = await getPostByUserIdApi(id, type);
        if (req.success) {
          return req.data;
        }
      } else {
        Alert.alert("Người dùng đã xóa bài viết này.");
      }
    };

    const handleGotoDetailPost = async () => {
      const postData = await getDataPost();

      postData?.map((data, index) => {
        if (data._id === item.post._id) {
          navigation.navigate("DetailPost", {
            dataPersonal: postData,
            index: index,
          });
          return;
        }
      });
    };

    const handleGotoPer = (selectedUserId) => {
      navigation.navigate("Personal", {
        type: "viewProfile",
        authorID: selectedUserId,
      });
    };
    return (
      <TouchableOpacity
        onPress={() =>
          item.type === "requestFriend" || item.type === "acceptFriend"
            ? handleGotoPer(item.sender._id)
            : handleGotoDetailPost()
        }
        key={item._id}
      >
        <View
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
            <ImageCustom
              resizeMode="cover"
              style={{ width: 40, height: 40 }}
              type={"avatar"}
              source={{
                uri: item.sender.picturePath,
              }}
            />
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
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  marginLeft: 5,
                  marginBottom: 5,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>
                  {username}{" "}
                  <Text
                    style={{
                      color: "grey",
                      fontWeight: "300",
                      fontSize: 14,
                    }}
                  >
                    {content} {formatTime(item.createdAt)}
                  </Text>
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              height: 50,
              width: 50,
              display: "flex",
              justifyContent: "center",
              marginRight: 20,
            }}
          >
            {item.post && (
              <ImageCustom
                source={{
                  uri: item.post?.assets[0].url,
                }}
                resizeMode={"cover"}
                style={{ aspectRatio: 1, borderRadius: 12 }}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {
        <ScrollView style={{ flex: 1 }}>
          {noticesToday.length > 0 && (
            <View
              style={{
                flex: 1,
                marginTop: 20,
              }}
            >
              <View style={{ marginLeft: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  Mới nhất
                </Text>
              </View>
              {noticesToday.map((item, index) =>
                renderNotifications(item, index)
              )}
            </View>
          )}
          {noticesIn7Days.length > 0 && (
            <View
              style={{
                flex: 1,
                marginTop: 20,
                borderTopWidth: 0.2,
                borderTopColor: "gray",
                paddingVertical: 20,
              }}
            >
              <View style={{ marginLeft: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  7 ngày qua
                </Text>
              </View>
              {noticesIn7Days.map((item, index) =>
                renderNotifications(item, index)
              )}
            </View>
          )}
          {noticesIn30Days.length > 0 && (
            <View
              style={{
                flex: 1,
                borderTopWidth: 0.2,
                borderTopColor: "gray",
                paddingVertical: 20,
              }}
            >
              <View style={{ marginLeft: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  30 ngày qua
                </Text>
              </View>
              {noticesIn30Days.map((item, index) =>
                renderNotifications(item, index)
              )}
            </View>
          )}
          {noticesToday.length === 0 &&
            noticesIn7Days.length === 0 &&
            noticesIn30Days.length === 0 && (
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: Dimensions.get("screen").width,
                }}
              >
                <Text
                  style={{ fontWeight: "bold", fontSize: 20, marginBottom: 20 }}
                >
                  Bạn chưa nhận được thông báo nào.
                </Text>
                <Icon name="notification" size={30} />
              </View>
            )}
        </ScrollView>
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
});

export default Notification;
