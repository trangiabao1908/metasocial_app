import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { fetchMessageApi } from "../../api/userApi";
import ImageCustom from "../custom/imageCustom";
import FooterComponent from "./FooterComponent";
import HeaderComponent from "./HeaderComponent";

const ListMessage = ({
  data,
  messages,
  preMessageImage,
  loadingMesasge,
  setMessages,
  setDeleteMessages,
  flatListRef,
  deleteMessages,
  loadingFetchMessage,
}) => {
  const { _id, username, picturePath } = data;
  const userLoggedId = useSelector((state) => state?.userState?.user?._id);
  const [refreshing, setRefreshing] = useState(false);
  const [showHeaderComponent, setShowHeaderComponent] = useState(false);
  const [lastMessageCreatedAt, setLastMessageCreatedAt] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [loadMore, setLoadMore] = useState(true);
  const handleShowTime = (messageId) => {
    if (selectedMessageId !== messageId || selectedMessageId === null) {
      setSelectedMessageId(messageId);
    } else {
      setSelectedMessageId(null);
    }
  };
  const fetchMessage = async (_id) => {
    const res = await fetchMessageApi(_id, lastMessageCreatedAt);
    if (res && res && res.success) {
      if (res.messages.length > 0) {
        setMessages((prevMessages) => [
          ...res.messages.reverse(),
          ...prevMessages,
        ]);
        const lastMessage = res?.messages[0];
        setLastMessageCreatedAt(lastMessage.createdAt);
      } else {
        setLoadMore(false);
        setShowHeaderComponent(true);
      }
      setRefreshing(false);
    }
  };
  const handleGetPreMessage = useCallback(() => {
    if (loadMore) {
      console.log("Loading more...");
      setRefreshing(true);
      setTimeout(() => {
        fetchMessage(_id);
      }, 100);
    }
  }, [fetchMessage, _id]);
  useEffect(() => {
    let scrollToEndMessage;
    if (messages.length > 0 && flatListRef.current && !loadingFetchMessage) {
      scrollToEndMessage = setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: false });
      }, 300);
      setLastMessageCreatedAt(messages[0]?.createdAt);
    }
    return () => {
      if (scrollToEndMessage) {
        clearTimeout(scrollToEndMessage);
      }
    };
  }, [loadingMesasge]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        if (messages?.length > 0 && flatListRef.current) {
          setTimeout(() => {
            flatListRef.current.scrollToEnd({ animated: true });
          }, 100);
        }
      }
    );
    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);
  const handleSelectMessage = (item) => {
    const isSlected = deleteMessages.includes(item);
    if (isSlected) {
      setDeleteMessages((preMessage) =>
        preMessage.filter((message) => message._id !== item._id)
      );
    } else {
      setDeleteMessages((preMessage) => [...preMessage, item]);
    }
  };
  const formatTime = (time) => {
    const options = {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "Asia/Ho_Chi_Minh",
    };
    return new Date(time).toLocaleString("vi", options);
  };

  const renderListMessage = ({ item }) => {
    const isSelected = deleteMessages.includes(item);
    return (
      <View key={item?._id.toString()}>
        {selectedMessageId === item?._id && (
          <Text
            style={{
              fontSize: 12,
              textAlign: "center",
              color: "#CCCCCC",
              marginTop: 10,
              fontWeight: "500",
            }}
          >
            {formatTime(item?.createdAt)}
          </Text>
        )}
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 10,
            marginVertical: 15,
            justifyContent:
              item?.senderId._id.toString() === userLoggedId
                ? "flex-end"
                : "flex-start",
          }}
        >
          {item?.senderId._id.toString() !== userLoggedId && (
            <>
              <ImageCustom
                source={{ uri: `${picturePath}` }}
                style={[
                  { width: 40, height: 40, marginRight: 5 },
                  item?.messageType === "image" && { marginTop: 10 },
                ]}
                type="avatar"
              />
            </>
          )}
          <Pressable
            onPress={() => handleShowTime(item._id)}
            onLongPress={() => handleSelectMessage(item)}
            style={[
              item?.senderId._id.toString() === userLoggedId
                ? {
                    backgroundColor:
                      item?.messageType === "text"
                        ? "rgb(55, 151, 240)"
                        : "white",
                    padding: 10,
                    borderRadius: 24,
                    maxWidth: "60%",
                    marginBottom: 5,
                    marginRight: item?.messageType === "text" ? 5 : 0,
                  }
                : {
                    backgroundColor:
                      item?.messageType === "text" ? "#DB7093" : "white",
                    padding: 10,
                    marginLeft: item?.messageType === "text" ? 5 : 0,
                    borderRadius: 24,
                    maxWidth: "60%",
                    marginBottom: 5,
                  },
              ,
              isSelected && {
                backgroundColor: "#E6E6FA",
                shadowColor: "#000",
                shadowOpacity: 0.35,
                shadowRadius: 9,
              },
            ]}
          >
            {item?.messageType === "text" ? (
              <Text
                style={{
                  color: "white",
                  textAlign: "left",
                  fontWeight: "500",
                  fontSize: 14,
                }}
              >
                {item?.message}
              </Text>
            ) : (
              <ImageCustom
                source={{ uri: `${item?.imageUrl}` }}
                style={{
                  width: 190,
                  height: 190,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
                resizeMode="contain"
                type={item?.messageType}
              />
            )}
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      style={styles.container}
      data={messages}
      keyExtractor={(item) => item?._id.toString()}
      renderItem={renderListMessage}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          style={{ transform: [{ scale: 0.6 }] }}
          onRefresh={handleGetPreMessage}
        />
      }
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        showHeaderComponent || messages.length < 20 ? (
          <HeaderComponent
            picturePath={picturePath}
            username={username}
            selectedUserId={_id}
          />
        ) : (
          <></>
        )
      }
      ListFooterComponent={
        <FooterComponent
          preMessageImage={preMessageImage}
          loadingMesasge={loadingMesasge}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ListMessage;
