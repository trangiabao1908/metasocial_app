import {
  StyleSheet,
  Text,
  View,
  Modal,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import Icon from "react-native-vector-icons/AntDesign";

import { Formik } from "formik";
import * as yup from "yup";
import {
  UpdateCommentPostApi,
  commentPost,
  delCommentPostApi,
  delReplyCommentApi,
  getCommentPostApi,
  editReplyCommentApi,
  replyCommentApi,
} from "../../api/postApi";
import { useEffect, useState, useRef } from "react";
import SwipeableView from "../custom/swipe";
import { useSelector } from "react-redux";
import ImageCustom from "../custom/imageCustom";
import { formatTime } from "../../utils/setTime";
import { EventRegister } from "react-native-event-listeners";

const ModalComments = ({
  modalVisible,
  handleCloseModal,
  postID,
  setLengthComments,
  lengthComments,
}) => {
  const [allComments, setAllComments] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [commentEdit, setCommentEdit] = useState("");
  const [idComment, setIdComment] = useState("");
  const [isReply, setIsReply] = useState(false);
  const [cmtReply, setCmtReply] = useState("");
  const [tag, setTag] = useState("");
  const [idTag, setIdTag] = useState("");
  const [idReply, setIdReply] = useState("");
  const [isEditReply, setIsEditReply] = useState(false);

  const editRef = useRef();

  const user = useSelector((state) => state.userState?.user);

  const validationSchema = yup.object().shape({
    comment: yup.string().max(100, ({ max }) => `Giới hạn là ${max} chữ`),
  });

  useEffect(() => {
    if (modalVisible) {
      handleGetComments();
    }
  }, [modalVisible]);

  const handleGetComments = async () => {
    const req = await getCommentPostApi(postID);
    if (req && req?.status) {
      EventRegister.emit("onSuccessUpdatePost");
      setAllComments(req.data);

      setLengthComments(req.data.length);
      setIsLoading(false);
    }
  };

  const handleCloseModelComment = () => {
    handleCloseModal();
  };

  const handleCommentPost = async (values, { setFieldValue }) => {
    if (isEditReply) {
      console.log("Update Reply Comment");
      handleEditReplyComment();
    } else if (isEdit) {
      console.log("Update comment");
      handleUpdateComment();
    } else if (isReply) {
      console.log("Reply Comment");
      handleSubmitReply();
    } else {
      console.log("comment");
      let data = {
        postID: postID,
        comment: values.comment,
      };
      setFieldValue("comment", "");
      const req = await commentPost(data);
      if (req) {
        setTimeout(() => handleGetComments(), 200);
      }
    }
  };

  const handleDelCommentPost = async (id) => {
    const req = await delCommentPostApi(postID, id);
    if (req && req?.status) {
      console.log("Delete success");
      setIsEdit(false);
      setCommentEdit("");

      setTimeout(() => {
        handleGetComments();
      }, 200);
    }
  };

  const handleOpenEditComment = async (item) => {
    setIsEdit(!isEdit);
    setCommentEdit(item.comment);
    setIdComment(item._id);
    setIsEditReply(false);
  };

  // HANDLE OPEN EDIT REPLY COMMENT
  const handleOpenEditReplyComment = async (rep, item) => {
    setIsEditReply(!isEditReply);
    setIsEdit(false);
    setCommentEdit(rep.comment);
    setIdComment(item._id);
    setIdReply(rep._id);
  };

  const handleUpdateComment = async () => {
    let data = {
      postID: postID,
      id: idComment,
      comment: commentEdit,
    };
    const req = await UpdateCommentPostApi(data);
    if (req) {
      console.log("Update success");
      setTimeout(() => {
        handleGetComments();
      }, 200);
      setCommentEdit("");
      setIsEdit(false);
    }
  };

  // HANDLE EDIT REPLY COMMENT
  const handleEditReplyComment = async () => {
    let data = {
      postID: postID,
      cmtID: idComment,
      comment: commentEdit,
      replyID: idReply,
    };
    const req = await editReplyCommentApi(data);
    if (req) {
      console.log("Update reply comment");
      setTimeout(() => {
        handleGetComments();
      }, 200);
      setCommentEdit("");
      setIsEdit(false);
      setIsEditReply(false);
    }
  };

  const handleSubmitReply = async () => {
    let data = {
      postID: postID,
      id: idComment,
      comment: cmtReply,
      tag: idTag,
    };
    const req = await replyCommentApi(data);
    if (req && req?.status) {
      setTimeout(() => {
        handleGetComments();
      }, 200);
      setCmtReply("");
      setIsReply(false);
      setTag("");
    }
  };

  const handleChangeTextEdit = (text) => {
    setCommentEdit(text);
  };

  const handleChangeTextReply = (text) => {
    setCmtReply(text);
  };

  const handleReplyComment = (item) => {
    setIdComment(item._id);
    setTag(item.user.username);
    setIdTag(item.user._id);
    setIsReply(true);
  };

  const handleReplyChildComment = (item, rep) => {
    setIdComment(item._id);
    setTag(rep.user.username);
    setIdTag(rep.user._id);
    setIsReply(true);
  };

  const handleDelReply = async (id, item) => {
    let data = {
      postID: postID,
      commentID: item._id,
      replyID: id,
    };
    console.log(data);
    const req = await delReplyCommentApi(data);
    if (req && req?.status) {
      console.log("Delete success");
      setIsEdit(false);
      setTimeout(() => {
        handleGetComments();
      }, 200);
    }
  };

  const cancelReply = () => {
    setIsReply(false);
    setCmtReply("");
  };

  const cancelEdit = () => {
    setCommentEdit("");
    setIsEdit(false);
    setIsEditReply(false);
  };

  const renderComments = (item, index) => {
    return (
      <View key={item._id}>
        <SwipeableView
          postID={postID}
          handleDelCommentPost={() => handleDelCommentPost(item._id)}
          handleOpenEditComment={() => handleOpenEditComment(item)}
          index={index}
          isAuthor={item.user._id === user?._id ? true : false}
        >
          <View
            ref={editRef}
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
                // width: "80%",
              }}
            >
              <ImageCustom
                resizeMode="cover"
                style={{ width: 40, height: 40 }}
                type={"avatar"}
                source={{ uri: item.user.picturePath }}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: 5,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: 5,
                    marginBottom: 5,
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>
                    {item.user.username}
                  </Text>
                  <Text
                    style={{
                      color: "grey",
                      fontWeight: "300",
                      marginLeft: 5,
                      fontSize: 12,
                    }}
                  >
                    {formatTime(item.time)}
                  </Text>
                </View>
                <View
                  style={{
                    marginLeft: 5,
                    maxWidth: 270,
                  }}
                >
                  <Text style={{ fontWeight: "500", marginBottom: 5 }}>
                    {item.comment}
                  </Text>
                  <TouchableOpacity onPress={() => handleReplyComment(item)}>
                    <Text
                      style={{
                        color: "grey",
                        fontWeight: "600",
                        fontSize: 12,
                      }}
                    >
                      Trả lời
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View>
              <Icon.Button
                name="hearto"
                size={18}
                color="grey"
                backgroundColor="#ffffff"
                iconStyle={{
                  marginRight: 0,
                }}
              />
            </View>
          </View>
        </SwipeableView>

        {item.reply &&
          item.reply.map((rep, i) => {
            return (
              <SwipeableView
                key={rep._id}
                postID={postID}
                handleDelCommentPost={() => handleDelReply(rep._id, item)}
                handleOpenEditComment={() =>
                  handleOpenEditReplyComment(rep, item)
                }
                index={i}
                isAuthor={rep.user._id === user._id ? true : false}
                check={false}
              >
                <View
                  ref={editRef}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 5,
                    marginLeft: 50,
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      // width: "80%",
                    }}
                  >
                    <ImageCustom
                      resizeMode="cover"
                      style={{ width: 40, height: 40 }}
                      type={"avatar"}
                      source={{ uri: rep.user.picturePath }}
                    />
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: 5,
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          marginLeft: 5,
                          marginBottom: 5,
                        }}
                      >
                        <Text style={{ fontWeight: "bold" }}>
                          {rep.user.username}
                        </Text>
                        <Text
                          style={{
                            color: "grey",
                            fontWeight: "300",
                            marginLeft: 5,
                            fontSize: 12,
                          }}
                        >
                          {formatTime(rep.time)}
                        </Text>
                      </View>
                      <View
                        style={{
                          marginLeft: 5,
                          maxWidth: 220,
                        }}
                      >
                        {rep.tag ? (
                          <Text style={{ color: "#405DE6" }}>
                            @{rep.tag.username}{" "}
                            <Text
                              style={{
                                fontWeight: "500",
                                marginBottom: 5,
                                color: "black",
                              }}
                            >
                              {rep.comment}
                            </Text>
                          </Text>
                        ) : (
                          <Text style={{ fontWeight: "500", marginBottom: 5 }}>
                            {rep.comment}
                          </Text>
                        )}
                        <TouchableOpacity
                          onPress={() => handleReplyChildComment(item, rep)}
                        >
                          <Text
                            style={{
                              color: "grey",
                              fontWeight: "600",
                              fontSize: 12,
                            }}
                          >
                            Trả lời
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  <View>
                    <Icon.Button
                      name="hearto"
                      size={18}
                      color="grey"
                      backgroundColor="#ffffff"
                      iconStyle={{
                        marginRight: 0,
                      }}
                    />
                  </View>
                </View>
              </SwipeableView>
            );
          })}
      </View>
    );
  };

  const renderNoComments = () => {
    return (
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
          Chưa có bình luận nào
        </Text>
        <Text style={{ color: "grey" }}>Bắt đầu trò chuyện</Text>
      </View>
    );
  };

  return (
    <View>
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={handleCloseModelComment}
        animationType="fade"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.3)" }}
          // keyboardVerticalOffset={height - 30}
        >
          <Formik
            initialValues={{
              comment: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleCommentPost}
          >
            {({
              handleChange,
              handleSubmit,
              values,
              setFieldValue,
              errors,
            }) => (
              <>
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <TouchableOpacity onPress={handleCloseModelComment}>
                    <View
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    ></View>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    backgroundColor: "white",
                    flex: 3,
                    borderTopLeftRadius: 26,
                    borderTopRightRadius: 26,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
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
                    <View style={styles.header}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          alignItems: "flex-end",
                          justifyContent: "flex-end",
                          textAlign: "center",
                        }}
                      >
                        Bình luận
                      </Text>
                    </View>
                  </View>

                  <SafeAreaView style={styles.content}>
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: "flex-start",
                      }}
                    >
                      {!isLoading &&
                        allComments?.map((item, index) =>
                          renderComments(item, index)
                        )}

                      {lengthComments === 0 && renderNoComments()}
                    </ScrollView>
                  </SafeAreaView>
                  <View style={styles.footer}>
                    {isReply && (
                      <View
                        style={{
                          marginLeft: 70,
                          marginBottom: 5,

                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <Text>
                          Đang trả lời{" "}
                          <Text style={{ color: "blue" }}>@{tag}</Text>
                        </Text>
                        <TouchableOpacity onPress={cancelReply}>
                          <Text
                            style={{
                              marginLeft: 15,
                              textDecorationLine: "underline",
                            }}
                          >
                            Hủy
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {isEdit && (
                      <View
                        style={{
                          marginLeft: 70,
                          marginBottom: 5,

                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <Text>Đang chỉnh sửa </Text>
                        <TouchableOpacity onPress={cancelEdit}>
                          <Text
                            style={{
                              marginLeft: 15,
                              textDecorationLine: "underline",
                            }}
                          >
                            Hủy
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    {isEditReply && (
                      <View
                        style={{
                          marginLeft: 70,
                          marginBottom: 5,

                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <Text>Đang chỉnh sửa </Text>
                        <TouchableOpacity onPress={cancelEdit}>
                          <Text
                            style={{
                              marginLeft: 15,
                              textDecorationLine: "underline",
                            }}
                          >
                            Hủy
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    <View style={styles.wrapperInput}>
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 360,
                          borderColor: "grey",
                          borderWidth: 0.2,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 5,
                        }}
                      >
                        <ImageCustom
                          resizeMode="cover"
                          style={[styles.avatar]}
                          source={{ uri: user?.picturePath }}
                          type={"avatar"}
                        />
                      </View>

                      <View style={styles.input}>
                        <TextInput
                          style={{
                            width: "80%",
                          }}
                          pointerEvents="box-only"
                          underlineColorAndroid="transparent"
                          multiline
                          keyboardType="default"
                          placeholder="Bình luận của bạn..."
                          onChangeText={
                            isEdit || isEditReply
                              ? (text) => handleChangeTextEdit(text)
                              : isReply
                              ? (text) => handleChangeTextReply(text)
                              : handleChange("comment")
                          }
                          // onBlur={handleBlur("comment")}
                          value={
                            isEdit
                              ? commentEdit
                              : isEditReply
                              ? commentEdit
                              : isReply
                              ? cmtReply
                              : values.comment
                          }
                        />
                        {values.comment || commentEdit || cmtReply ? (
                          <TouchableOpacity onPress={handleSubmit}>
                            <View
                              style={[
                                styles.wrapIcon,
                                { backgroundColor: "rgb(0, 149, 246)" },
                              ]}
                            >
                              <Icon name="arrowup" color="white" size={25} />
                            </View>
                          </TouchableOpacity>
                        ) : (
                          <View style={styles.wrapIcon}>
                            <Icon name="arrowup" color="white" size={25} />
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </>
            )}
          </Formik>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  header: {
    paddingTop: 15,
    paddingBottom: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
    borderBottomColor: "rgb(219, 219, 219)",
    borderBottomWidth: 0.5,
  },

  btnSend: {
    position: "absolute",
    right: 15,
    top: 0,
  },
  content: {
    paddingHorizontal: 15,
    flex: 4,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 360,
  },
  footer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderTopColor: "rgb(219, 219, 219)",
    borderTopWidth: 0.5,
  },

  wrapperInput: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
    justifyContent: "space-around",
  },
  wrapIcon: {
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 5,
    display: "flex",
    justifyContent: "center",
  },
  input: {
    paddingVertical: 5,
    marginLeft: 15,
    flexDirection: "row",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default ModalComments;
