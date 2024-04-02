import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { EventRegister } from "react-native-event-listeners";
import AntDesign from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/Feather";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useDispatch } from "react-redux";
import {
  deletePostApi,
  getPostByUserIdApi,
  hideCommentApi,
} from "../../api/postApi";
import { deletePostRD } from "../../redux/post";

const ModalEdit = ({
  modalEditVisible,
  handleCloseModalEdit,
  postID,
  isAuthor,
  author,
  disableComment,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [postData, setPostData] = useState([]);

  useEffect(() => {
    getPostByUser();
  }, []);

  const getPostByUser = async () => {
    let id = author;
    let type = "viewProfile";

    const req = await getPostByUserIdApi(id, type);
    if (req && req.success) {
      setPostData(req.data);
    }
  };

  const handleDeletePost = async () => {
    const del = await deletePostApi(postID);
    if (del.status) {
      // EventRegister.emit("updatePostSuccess");
      EventRegister.emit("onSuccessUpdatedUser");

      EventRegister.emit("onSuccessUpdatePost");
      console.log("Success");
      dispatch(deletePostRD(postID));
      handleCloseModalEdit();
    }
  };

  const getPostByID = () => {
    const postByID = postData.filter((item) => item._id === postID);
    return postByID;
  };

  const handleOpenUpdatePost = () => {
    let dataUpdate = getPostByID(postID);
    console.log({ dataUpdate });
    navigation.navigate("Post", { dataUpdate: dataUpdate, type: "update" });
    handleCloseModalEdit();
  };

  const handleTurnOffComment = async () => {
    let disableComment = true;
    const req = await hideCommentApi(postID, disableComment);
    if (req && req?.status) {
      EventRegister.emit("onSuccessUpdatedUser");
      EventRegister.emit("onSuccessUpdatePost");
      handleCloseModalEdit();
    }
  };
  const handleTurnOnComment = async () => {
    let disableComment = false;
    const req = await hideCommentApi(postID, disableComment);
    if (req && req?.status) {
      EventRegister.emit("onSuccessUpdatedUser");
      EventRegister.emit("onSuccessUpdatePost");
      handleCloseModalEdit();
    }
  };

  return (
    <View>
      <Modal
        visible={modalEditVisible}
        transparent={true}
        onRequestClose={handleCloseModalEdit}
        animationType="fade"
      >
        <View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            flex: 1,
          }}
        >
          <View
            style={{
              flex: 1,
            }}
          >
            <TouchableOpacity onPress={handleCloseModalEdit}>
              <View
                style={{
                  width: "100%",
                  height: "100%",
                }}
              ></View>
            </TouchableOpacity>
          </View>

          <View style={styles.container}>
            <View style={[styles.flexCol]}>
              <View style={styles.centeredBox}>
                <View
                  style={{
                    width: 40,
                    height: 5,
                    backgroundColor: "grey",
                    borderRadius: 8,
                    opacity: 0.2,
                  }}
                ></View>
              </View>

              <View style={[styles.flexRow]}>
                <View style={[styles.flexCol, styles.centerItem, styles.box]}>
                  <Icon2 name="bookmark" size={15} style={styles.icon} />
                  <Text>Lưu</Text>
                </View>
                <View style={[styles.flexCol, styles.centerItem, styles.box]}>
                  <AntDesign name="skin" size={15} style={styles.icon} />
                  <Text>Remix</Text>
                </View>
              </View>
            </View>

            {/* <View style={[styles.flexCol, styles.box, styles.content2]}> */}
            <View style={[styles.content2]}>
              <View style={[styles.box]}>
                <View style={styles.borderWidth}>
                  <View style={[styles.flexRow, styles.itemLeft]}>
                    <AntDesign
                      name="closecircleo"
                      size={15}
                      style={styles.icon}
                    />
                    <Text style={styles.fontSize16}>
                      Tắt tùy chọn tái sử dụng
                    </Text>
                  </View>
                </View>
                <View style={styles.borderWidth}>
                  <View style={[styles.flexRow, styles.itemLeft]}>
                    <FontAwesome5
                      name="history"
                      size={15}
                      style={styles.icon}
                    />
                    <Text style={styles.fontSize16}>Lưu trữ</Text>
                  </View>
                </View>
                <View style={styles.borderWidth}>
                  <View style={[styles.flexRow, styles.itemLeft]}>
                    <Ionicons
                      name="heart-dislike-outline"
                      size={15}
                      style={styles.icon}
                    />
                    <Text style={styles.fontSize16}>Ẩn lượt thích</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={
                    disableComment ? handleTurnOnComment : handleTurnOffComment
                  }
                >
                  <View style={styles.borderWidth}>
                    <View style={[styles.flexRow, styles.itemLeft]}>
                      <MaterialCommunityIcons
                        name="comment-off-outline"
                        size={15}
                        style={styles.icon}
                      />
                      <Text style={styles.fontSize16}>
                        {disableComment
                          ? `Mở tính năng bình luận`
                          : `Tắt tính năng bình luận`}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={isAuthor ? handleOpenUpdatePost : null}
                  style={{ width: "100%" }}
                >
                  {isAuthor ? (
                    <View style={styles.borderWidth}>
                      <View style={[styles.flexRow, styles.itemLeft]}>
                        <AntDesign name="edit" size={15} style={styles.icon} />
                        <Text style={styles.fontSize16}>Chỉnh sửa</Text>
                      </View>
                    </View>
                  ) : (
                    <></>
                  )}
                </TouchableOpacity>
                <View style={styles.borderWidth}>
                  <View style={[styles.flexRow, styles.itemLeft]}>
                    <AntDesign name="pushpino" size={15} style={styles.icon} />
                    <Text style={styles.fontSize16}>
                      Ghim lên trang cá nhân
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={isAuthor ? handleDeletePost : null}
                  style={{ width: "100%" }}
                >
                  <View style={styles.noBorder}>
                    <View style={[styles.flexRow, styles.itemLeft]}>
                      {isAuthor ? (
                        <AntDesign
                          name="delete"
                          size={20}
                          style={[styles.icon, styles.textDelete]}
                        />
                      ) : (
                        <MaterialIcons
                          name="report"
                          size={20}
                          style={[styles.icon, styles.textDelete]}
                        />
                      )}
                      <Text style={[styles.fontSize16, styles.textDelete]}>
                        {isAuthor ? "Xóa" : "Báo cáo"}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 2,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    display: "flex",
    flexDirection: "column",
  },
  centeredBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    marginVertical: 15,
    alignItems: "stretch",
    // backgroundColor: "red",
  },
  flexCol: {
    display: "flex",
    flexDirection: "column",
  },
  centerItem: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  leftItem: {
    justifyContent: "flex-start",
  },
  box: {
    backgroundColor: "#E5E5E5",
    borderRadius: 12,
    marginHorizontal: 15,
    paddingVertical: 5,
  },
  content2: {
    marginTop: 10,
    marginBottom: 50,
    justifyContent: "center",
  },

  itemLeft: {
    alignItems: "center",
    width: "100%",
  },
  icon: {
    paddingVertical: 5,
    marginHorizontal: 20,
  },
  fontSize16: {
    fontSize: 16,
  },
  textDelete: {
    color: "red",
  },
  borderWidth: {
    borderBottomColor: "rgb(219, 219, 219)",
    borderBottomWidth: 1,
    width: "100%",
  },
  noBorder: {
    width: "100%",
  },
});

export default ModalEdit;
