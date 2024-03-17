import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";

import Header from "../../components/home/header";
import Post from "../../components/home/post";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import Footer from "../../components/footer";
import ListStories from "../../components/stories";
import { getAllPostApi } from "../../api/postApi";
import ImageCustom from "../../components/custom/imageCustom";
import { useDispatch, useSelector } from "react-redux";
import { clearPost, getAllPostSuccess, loadMorePost } from "../../redux/post";
import { EventRegister } from "react-native-event-listeners";
import PostSkeleton from "../../components/custom/skeleton";
import { getImageFromCache } from "../../utils/caching";
import socket from "../../utils/configSocket";
import Icon from "react-native-vector-icons/Entypo";

// import { ref, listAll, getDownloadURL } from "firebase/storage";
// import { storage } from "../../firebase/config";

const storiesData = [
  {
    id: 1,
    name: "tptp.here",
    // source: require("../../assets/icon_avatar.png"),
  },
];

const HeaderContent = () => {
  const renderListStories = ({ item }) => {
    return <ListStories name={item.name} source={item.source} id={item.id} />;
  };
  return (
    <SafeAreaView
      style={{
        borderBottomColor: "rgb(219, 219, 219)",
        borderBottomWidth: 0.5,
      }}
    >
      <FlatList
        data={storiesData}
        renderItem={renderListStories}
        keyExtractor={(item) => item.id}
        horizontal
        initialScrollIndex={0}
        showsHorizontalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const Home = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const postData = useSelector((state) => state.postState?.post);
  const user = useSelector((state) => state.userState?.user?._id);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [updatedAt, setUpdatedAt] = useState("");
  const [clickCount, setClickCount] = useState(0);
  const clickTimer = useRef(null);

  const flatListRef = useRef();
  const videoRef = useRef(null);

  useEffect(() => {
    setTimeout(onRefresh, 200);

    // socket.emit("userIdLogged", user);

    const eventListener = () => {
      console.log("get Post");
      onRefresh();
    };

    EventRegister.addEventListener("updatePostSuccess", eventListener);

    return () => {
      EventRegister.removeEventListener(eventListener);

      console.log("Exit");
    };
  }, []);

  useEffect(() => {
    if (clickCount === 1) {
      clickTimer.current = setTimeout(() => {
        handleScrollToTop();
        setClickCount(0);
      }, 200);
    } else if (clickCount === 2) {
      clearTimeout(clickTimer.current);

      onRefresh();
      setClickCount(0);
    }
    return () => {
      clearTimeout(clickTimer.current);
    };
  }, [clickCount]);

  const loadMoreData = async () => {
    console.log("Load more data");

    try {
      const req = await getAllPostApi(updatedAt);
      if (req.success) {
        if (req.posts.length > 0) {
          const latedPost = req.posts[req.posts.length - 1];
          setUpdatedAt(latedPost.updatedAt);
          dispatch(loadMorePost(req.posts));
          setLoading(false);

          if (req.isLastElement) {
            setIsEmpty(true);
          } else {
            setIsEmpty(false);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRefreshing = async () => {
    // console.log("Call API Refreshing");
    try {
      let query = "";
      dispatch(clearPost());
      const req = await getAllPostApi(query);

      if (req.success) {
        if (req.posts.length > 0) {
          const latedPost = req.posts[req.posts.length - 1];
          setUpdatedAt(latedPost.updatedAt);
          dispatch(getAllPostSuccess(req.posts));
          setIsFirstTime(false);
        }
        if (req.isLastElement) {
          setIsEmpty(true);
        } else {
          setIsEmpty(false);
        }

        setRefreshing(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleScrollToTop = () => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({ animated: true, index: 0 });
      }, 200);
    }
  };

  const onRefresh = () => {
    console.log("Refreshing");
    setIsEmpty(false);
    setTimeout(() => {
      setRefreshing(true);
      handleRefreshing();
    }, 200);
  };

  const handleEndReached = () => {
    if (!loading && !isEmpty && !isFirstTime) {
      console.log("reached");
      setLoading(true);
      setTimeout(() => loadMoreData(), 500);
    }
  };

  const handleClick = () => {
    setClickCount((prevCount) => prevCount + 1);
    if (clickTimer.current !== null) {
      clearTimeout(clickTimer.current);
    }
  };

  const renderPosts = ({ item }) => {
    let isLike = item.like?.filter((data) => data.user === user);

    return (
      <Post
        id={item._id}
        author={item.author}
        title={item.title}
        assets={item.assets}
        like={item.like}
        comment={item.comment}
        isLike={isLike.length ? true : false}
        updatedAt={item.createdAt}
        disableComment={item.disableComment}
      />
    );
  };

  return (
    <SafeAreaView style={style.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={style.content}>
        <SafeAreaView>
          {refreshing ? (
            <PostSkeleton />
          ) : (
            <FlatList
              data={postData}
              ref={flatListRef}
              renderItem={renderPosts}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.1}
              ListHeaderComponent={<HeaderContent />}
              ListFooterComponent={
                isEmpty ? (
                  <View
                    style={{
                      backgroundColor: "#e0e0e0",
                      padding: 20,
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Icon
                      name="emoji-sad"
                      size={20}
                      style={{ marginRight: 5 }}
                    />
                    <Text>Opps! Không có bài đăng nào mới!</Text>
                  </View>
                ) : (
                  <ActivityIndicator size="small" />
                )
              }
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          )}
        </SafeAreaView>
      </View>
      {!refreshing && (
        <SafeAreaView style={style.footer}>
          <Footer
            navigation={navigation}
            isActive={0}
            handleClick={handleClick}
          />
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "white",
    flex: 1,
  },

  content: {
    flex: 1,
  },

  footer: {
    borderTopColor: "rgb(219, 219, 219)",
    borderTopWidth: 0.5,
  },
});

export default Home;
