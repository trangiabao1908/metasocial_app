import { useHeaderHeight } from "@react-navigation/elements";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { useSelector } from "react-redux";
import { deleteMessageApi, fetchMessageApi } from "../../api/userApi";
import LeftHeader from "../../components/custom/leftHeader";
import RightHeader from "../../components/custom/rightHeader";
import InputMessage from "../../components/message/inputMessage";
import ListMessage from "../../components/message/listMessage";
import socket from "../../utils/configSocket";
const Message = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [loadingMesasge, setLoadingMessage] = useState(false);
  const [loadingFetchMessage, setLoadingFetchMessage] = useState(true);
  const userLoggedId = useSelector((state) => state?.userState?.user?._id);
  const { data } = route.params;
  const [preMessageImage, setPreMessageImage] = useState(null);
  const [deleteMessages, setDeleteMessages] = useState([]);
  const flatListRef = useRef();
  let chatID;
  useEffect(() => {
    const fetchMessage = async () => {
      const res = await fetchMessageApi(data?.userInfo?._id, "");
      if (res && res.success) {
        setMessages(res.messages.reverse());
        setLoadingFetchMessage(!loadingFetchMessage);
        socket.emit("chatId", res.chatId);
        chatID = res?.chatId;
      }
    };
    fetchMessage();
  }, []);
  useEffect(() => {
    socket.on("fetchChat", (newMessage) => {
      if (newMessage.receiverId._id.toString() === userLoggedId.toString()) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        flatListRef.current
          ? setTimeout(
              () => flatListRef.current.scrollToEnd({ animated: true }),
              300
            )
          : {};
      }
    });
    socket.on("deletedMessage", ({ deletedMessages }) => {
      console.log(deletedMessages);
      setMessages((prevMessages) => {
        const remainingMessages = prevMessages.filter((message) =>
          deletedMessages.every(
            (deletedMessage) =>
              JSON.stringify(message) !== JSON.stringify(deletedMessage)
          )
        );
        return remainingMessages;
      });
    });
    return () => {
      socket.off("fetchChat");
      socket.off("deletedMessage");
      socket.emit("leaveRoom", chatID);
      console.log("Disconected fetch chat event");
    };
  }, []);
  const handleDeleteMessage = async () => {
    const values = {
      receiverId: data?.userInfo?._id,
      messages: deleteMessages,
    };
    const res = await deleteMessageApi(values);
    if (res && res && res.success) {
      Alert.alert("Thông Báo", res.message);
      const remainingMessages = messages.filter(
        (message) => !deleteMessages.includes(message)
      );
      setMessages(remainingMessages);
    }
    setDeleteMessages([]);
  };
  const height = useHeaderHeight();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () =>
        deleteMessages.length > 0 ? (
          <>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon
                name="left"
                size={25}
                style={{ marginLeft: -5, marginRight: 5 }}
                color="#000"
                backgroundColor="#ffffff"
              />
            </TouchableOpacity>
            <View>
              <Text style={{ fontSize: 22, fontWeight: "500", marginLeft: 10 }}>
                {deleteMessages?.length}
              </Text>
            </View>
          </>
        ) : (
          <>
            <LeftHeader screen={"message"} data={data}></LeftHeader>
          </>
        ),
      headerRight: () =>
        deleteMessages.length > 0 ? (
          <>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => setDeleteMessages([])}
                style={{ padding: 5, marginRight: 8 }}
              >
                <SimpleLineIcons
                  style={{ fontWeight: "bold" }}
                  name="action-undo"
                  size={25}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeleteMessage}
                style={{ padding: 5 }}
              >
                <MaterialIcons
                  style={{ fontWeight: "bold" }}
                  name="delete-outline"
                  size={25}
                />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <RightHeader screen={"message"}></RightHeader>
          </>
        ),
    });
  }, [navigation, data, deleteMessages]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "white" }}
      keyboardVerticalOffset={height}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          {!loadingFetchMessage ? (
            <>
              <ListMessage
                data={data?.userInfo}
                messages={messages}
                preMessageImage={preMessageImage}
                loadingMesasge={loadingMesasge}
                setMessages={setMessages}
                loadingFetchMessage={loadingFetchMessage}
                setDeleteMessages={setDeleteMessages}
                deleteMessages={deleteMessages}
                flatListRef={flatListRef}
              />
              <InputMessage
                selectedUserId={data?.userInfo?._id}
                messages={messages}
                setMessages={setMessages}
                setPreMessageImage={setPreMessageImage}
                setLoadingImage={setLoadingMessage}
                flatListRef={flatListRef}
              />
            </>
          ) : (
            <>
              <View
                style={{
                  marginTop: 20,
                  flex: 1,
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator color="#888888" />
              </View>
            </>
          )}
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Message;
