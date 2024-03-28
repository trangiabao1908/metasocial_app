import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { acceptFriendRequestAPI, getRequestFriendAPI } from "../../api/userApi";
import CustomButton from "../../components/custom/button";
import * as LocalAuthentication from "expo-local-authentication";
import ImageCustom from "../../components/custom/imageCustom";
import { setFriends } from "../../redux/user";
const Friends = ({ navigation }) => {
  const userLoggedId = useSelector((state) => state?.userState?.user?._id);
  const [friendsRequest, setFriendsRequest] = useState([]);
  const userFriends = useSelector((state) => state?.userState?.user?.friends);
  const isOpenValid = useSelector((state) => state?.userState?.user?.isAdmin);
  const dispatch = useDispatch();
  const handleAcceptFriend = async (needAcceptedId) => {
    const res = await acceptFriendRequestAPI(needAcceptedId);
    if (res && res.success) {
      Alert.alert(res.message);
      await getFriendsRequest();
      dispatch(setFriends(res.data));
    }
  };
  const getFriendsRequest = async () => {
    const res = await getRequestFriendAPI(userLoggedId);
    if (res && res.success) {
      setFriendsRequest(res.friendRequests);
    }
  };
  useEffect(() => {
    getFriendsRequest();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      getFriendsRequest();
    }, [])
  );
  const handleGoToPerScreen = (selectedUserId) => {
    navigation.navigate("Personal", {
      type: "viewProfile",
      authorID: selectedUserId,
    });
  };
  const renderRequestFriend = useCallback(({ item }) => {
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
          <TouchableOpacity onPress={() => handleGoToPerScreen(item?._id)}>
            <ImageCustom
              resizeMode="cover"
              style={{ width: 45, height: 45 }}
              type={"avatar"}
              source={{
                uri: item?.picturePath,
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
              }}
            >
              <Text style={{ fontWeight: "bold", marginBottom: 1 }}>
                {item?.username}
              </Text>
              <Text style={{ fontWeight: 400, color: "grey" }}>
                {item?.email.length < 20
                  ? item?.email
                  : item?.email?.substring(0, 20) + "..."}
              </Text>
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
          <CustomButton
            title={"Xác nhận"}
            style={{ backgroundColor: "#00D5FA" }}
            onPress={() => handleAcceptFriend(item?._id?.toString())}
            styleText={{
              paddingHorizontal: 10,
              paddingVertical: 8,
              color: "white",
              fontWeight: "500",
            }}
          />
        </View>
      </View>
    );
  }, []);

  const handleNavigateToMessageScreen = async (item) => {
    try {
      const values = {
        userInfo: {
          _id: item._id,
          username: item.username,
          picturePath: item.picturePath,
          email: item.email,
        },
      };
      if (isOpenValid) {
        const res = await LocalAuthentication.authenticateAsync();
        if (res?.success) {
          navigation.navigate("Message", { data: values });
        } else {
          if (
            res?.error === "not_enrolled" ||
            res?.error === "passcode_not_set"
          ) {
            Alert.alert(
              "Thông Báo",
              "Hãy cấu hình bảo mật của thiết bị để tiếp tục xem tin nhắn"
            );
          }
        }
      } else {
        navigation.navigate("Message", { data: values });
      }
    } catch (error) {
      console.error("Error navigating:", error);
    }
  };

  const renderFriends = useCallback(({ item }) => {
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
            onPress={() => handleGoToPerScreen(item._id.toString())}
          >
            <ImageCustom
              resizeMode="cover"
              style={{ width: 45, height: 45 }}
              type={"avatar"}
              source={{
                uri: item.picturePath,
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
                {item.username}
              </Text>
              <Text style={{ fontWeight: 400, color: "grey" }}>
                {item?.email.length < 20
                  ? item?.email
                  : item?.email?.substring(0, 20) + "..."}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => handleNavigateToMessageScreen(item)}>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              paddingHorizontal: 20,
              marginRight: 2,
            }}
          >
            <Ionicons
              name="chatbox-ellipses-outline"
              size={30}
              color="#000"
              backgroundColor="#ffffff"
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            backgroundColor: "rgb(240, 242, 245)",
            paddingVertical: 4,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginLeft: 20,
              color: "#333333",
            }}
          >
            Lời mời kết bạn
          </Text>
        </View>
        <FlatList data={friendsRequest} renderItem={renderRequestFriend} />
      </View>
      <View
        style={{
          height: 6,
          width: "100%",
        }}
      ></View>
      <View
        style={{
          flex: 2,
        }}
      >
        <View
          style={{
            backgroundColor: "rgb(240, 242, 245)",
            paddingVertical: 4,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginLeft: 20,
              color: "#333333",
            }}
          >
            Bạn bè
          </Text>
        </View>
        <FlatList data={userFriends} renderItem={renderFriends} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
});

export default Friends;
