import React, { memo } from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import { formatTime } from "../../utils/setTime";
import { getPostByUserIdApi } from "../../api/postApi";
import { useNavigation } from "@react-navigation/native";
import ImageCustom from "../custom/imageCustom";

const ContentNotification = ({ item }) => {
  const navigation = useNavigation();

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
    const index = postData.findIndex((data) => data._id === item?.post?._id);
    if (index !== -1) {
      navigation.navigate("DetailPost", {
        dataPersonal: postData,
        index: index,
      });
    }
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
    >
      <View style={styles.container}>
        <ImageCustom
          resizeMode="cover"
          style={styles.avatar}
          type={"avatar"}
          source={{
            uri: item?.sender?.picturePath,
          }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.username}>
            {item?.content?.split(" ")[0]}{" "}
            <Text style={styles.secondaryText}>
              {item?.content?.split(" ").slice(1).join(" ")}{" "}
              {formatTime(item.createdAt)}
            </Text>
          </Text>
        </View>
        <View style={styles.imageContainer}>
          {item.post && (
            <ImageCustom
              source={{ uri: item.post?.assets[0].url }}
              resizeMode="cover"
              style={styles.image}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    marginLeft: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 5,
  },
  textContainer: {
    width: "65%",
  },
  username: {
    fontWeight: "bold",
  },
  secondaryText: {
    color: "grey",
    fontWeight: "300",
    fontSize: 14,
  },
  imageContainer: {
    height: 50,
    width: 50,
    marginRight: 20,
  },
  image: {
    aspectRatio: 1,
    borderRadius: 12,
  },
};

export default memo(ContentNotification);
