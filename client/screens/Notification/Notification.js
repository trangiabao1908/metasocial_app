import React, { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { getNotificationApi } from "../../api/noticeApi";
import ContentNotification from "../../components/notification/content";
import HeaderComponent2 from "./HeaderComponent2";

const Notification = () => {
  const [noticesToday, setNoticesToday] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastedNotice, setLastedNotice] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);
  // const [isEndReached, setIsEndReached] = useState(false);

  const getNotification = useCallback(async () => {
    setLoading(true);
    try {
      const req = await getNotificationApi(lastedNotice);
      if (req) {
        setNoticesToday(req?.noticesToday);
        const latedNoti = req?.noticesToday[req?.noticesToday?.length - 1];
        setLastedNotice(latedNoti?.updatedAt);
        if (req.isLastElement) {
          setIsEmpty(true);
        }
        // setfirstTime(false);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    getNotification();
  }, []);

  const handleGetMoreNotice = useCallback(async () => {
    console.log({ lastedNotice });
    if (noticesToday.length > 0 && lastedNotice) {
      try {
        const req = await getNotificationApi(lastedNotice);
        if (req) {
          const newNotices = req?.noticesToday || [];
          setNoticesToday((prevNotices) => [...prevNotices, ...newNotices]);
          const latedNoti = newNotices[newNotices.length - 1];
          setLastedNotice(latedNoti.updatedAt);
          if (req.isLastElement) {
            setIsEmpty(true);
          }
        }
      } catch (error) {
        console.error("Error fetching more notifications:", error);
      } finally {
        // setIsEndReached(false);
        setLoading(false);
      }
    }
  }, [lastedNotice]);

  const renderNotifications = useCallback(({ item }) => {
    return <ContentNotification item={item} />;
  }, []);

  const handleEndReached = () => {
    if (!loading && !isEmpty) {
      handleGetMoreNotice();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size={"small"} />
      ) : (
        <View style={{ flex: 1, marginBottom: 5 }}>
          {noticesToday.length > 0 && (
            <FlatList
              style={{ flex: 1 }}
              data={noticesToday}
              renderItem={renderNotifications}
              keyExtractor={(item) => item?._id.toString()}
              ListHeaderComponent={<HeaderComponent2 />}
              onEndReached={handleEndReached}
              // onEndReachedThreshold={0.1}
              // onScroll={handleScroll}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
});

export default Notification;
