import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { memo, useEffect } from "react";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import Icon from "react-native-vector-icons/Entypo";
import Icon2 from "react-native-vector-icons/AntDesign";
import Icon3 from "react-native-vector-icons/Feather";
import { useState } from "react";
import ModalComments from "./modalcmt";
import ImageCustom from "../custom/imageCustom";
import ModalEdit from "./modaledit";
import { likePostApi } from "../../api/postApi";
import { useDispatch, useSelector } from "react-redux";
import { likePostRD } from "../../redux/post";
import { useNavigation } from "@react-navigation/native";
import { formatTime } from "../../utils/setTime";
import { Video } from "expo-av";

import socket from "../../utils/configSocket";

import { EventRegister } from "react-native-event-listeners";

const screenWidth = Dimensions.get("window").width;

const renderItems = ({ item, index }) => {
  return (
    <ImageCustom
      key={index}
      source={{
        // uri: getImage(item.url),
        uri: item.url,
      }}
      resizeMode="cover"
      style={{
        width: screenWidth,
      }}
    />
  );
};

// const getImage = async (imageUrl) => {
//   let imageData = await getImageFromCache(JSON.stringify(imageUrl));
//   if (!imageData) {
//     console.log("Not in cache");
//     // Image not in cache, download it
//     const response = await fetch(imageUrl);
//     imageData = await response.blob();
//     saveImageToCache(JSON.stringify(imageUrl), imageData);
//   } else {
//     console.log("In Cache");
//   }
//   return imageData;
// };

const Post = ({
  author,
  title,
  assets,
  like,
  comment,
  id,
  isLike,
  updatedAt,
  disableComment,
}) => {
  const navigate = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);

  const [lengthComments, setLengthComments] = useState(comment.length);

  const dispatch = useDispatch();

  const userID = useSelector((state) => state.userState?.user?._id);

  const handleOpenModal = () => {
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleOpenEdit = () => {
    setModalEditVisible(!modalEditVisible);
  };

  const handleCloseModalEdit = () => {
    setModalEditVisible(!modalEditVisible);
  };

  const handleLikePost = async () => {
    if (id) {
      const req = await likePostApi(id);
      if (req) {
        let listLike = req.post;
        let type = req.type;
        let indexUpdate = req.indexUpdate;
        dispatch(
          likePostRD({
            postID: id,
            listLike: listLike,
            type: type,
            indexUpdate: indexUpdate,
          })
        );
        EventRegister.emit("onSuccessUpdatePost");
      }
    }
  };

  const handleGoToPerScreen = () => {
    navigate.navigate("Personal", {
      type: "viewProfile",
      authorID: author._id,
    });
  };

  return (
    <View style={styles.container} key={id}>
      <View style={posts.container}>
        <View style={posts.header}>
          <View style={posts.header}>
            <TouchableOpacity onPress={handleGoToPerScreen}>
              <View style={posts.stories}>
                <ImageCustom
                  style={{ width: 35, height: 35 }}
                  resizeMode="cover"
                  source={{ uri: author.picturePath }}
                  type="avatar"
                />
              </View>
            </TouchableOpacity>
            <Text style={{ marginLeft: 10 }}>{author.username}</Text>

            <Icon name="dot-single" size={20} />
            <Text style={{ color: "grey", fontSize: 11 }}>
              {formatTime(updatedAt)}
            </Text>
          </View>

          <TouchableOpacity onPress={handleOpenEdit}>
            <View>
              <Icon
                name="dots-three-horizontal"
                size={15}
                style={{
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingBottom: 5,
                  paddingTop: 5,
                }}
              />
            </View>
          </TouchableOpacity>
        </View>

        <SafeAreaView>
          {assets[0].type === "video" ? (
            <View>
              <Video
                source={{ uri: assets[0].url }}
                style={{ aspectRatio: 3 / 4 }}
                useNativeControls
                resizeMode="cover"
                shouldPlay={false}

                // onPlaybackStatusUpdate={onPlaybackStatusUpdate}
              />
            </View>
          ) : (
            <SwiperFlatList
              autoplayLoop
              index={0}
              paginationStyle={{
                position: "absolute",
                display: "flex",
                flexDirection: "row",
                left: 0,
                bottom: -35,
                right: 0,
              }}
              paginationStyleItem={{
                width: 5,
                height: 5,
                marginHorizontal: 3,
              }}
              paginationStyleItemActive={{
                backgroundColor: "red",
              }}
              showPagination
              data={assets}
              renderItem={renderItems}
            />
          )}
        </SafeAreaView>

        <View style={posts.options}>
          <View style={posts.interact}>
            {isLike ? (
              <TouchableOpacity onPress={handleLikePost}>
                <Icon2
                  name={"heart"}
                  size={25}
                  style={[posts.icon, { color: "red" }]}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleLikePost}>
                <Icon2
                  name={"hearto"}
                  size={25}
                  style={[posts.icon, { color: "black" }]}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleOpenModal}>
              <Icon3 name="message-circle" size={25} style={posts.icon} />
            </TouchableOpacity>
            <Icon3 name="send" size={25} style={posts.icon} />
          </View>

          <View>
            <Icon3 name="bookmark" size={25} style={posts.icon} />
          </View>
        </View>
        <View style={posts.comment}>
          <TouchableOpacity
            onPress={() => navigate.navigate("LikeScreen", { id })}
          >
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
              {like.length} lượt thích
            </Text>
          </TouchableOpacity>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
              {author.username}
            </Text>
            <Text style={{ marginBottom: 5, marginLeft: 5 }}>{title}</Text>
          </View>
          {disableComment ? (
            <View>
              <Text style={{ color: "grey" }}>
                Tính năng bình luận đã bị tắt.
              </Text>
            </View>
          ) : (
            <TouchableOpacity onPress={handleOpenModal}>
              <View>
                <Text style={{ color: "grey" }}>
                  Xem tất cả {comment.length} bình luận
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* </View> */}
      <ModalComments
        postID={id}
        modalVisible={modalVisible}
        handleCloseModal={handleCloseModal}
        setLengthComments={setLengthComments}
        lengthComments={lengthComments}
      />
      <ModalEdit
        disableComment={disableComment}
        postID={id}
        modalEditVisible={modalEditVisible}
        handleCloseModalEdit={handleCloseModalEdit}
        isAuthor={author._id === userID ? true : false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
});

const posts = StyleSheet.create({
  container: {
    marginBottom: 10,
  },

  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 7,
  },

  stories: {
    display: "flex",
    justifyContent: "center",
    height: 40,
    width: 40,
    alignItems: "center",
    borderRadius: 360,
    borderColor: "grey",
    borderWidth: 0.2,
  },

  options: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  interact: {
    display: "flex",
    flexDirection: "row",
  },
  comment: {
    paddingHorizontal: 15,
  },
  icon: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default memo(Post);
