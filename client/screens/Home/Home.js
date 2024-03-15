import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useEffect, useRef, useState } from "react";
import { EventRegister } from "react-native-event-listeners";
import { useDispatch, useSelector } from "react-redux";
import { getAllPostApi } from "../../api/postApi";
import PostSkeleton from "../../components/custom/skeleton";
import Footer from "../../components/footer";
import Post from "../../components/home/post";
import ListStories from "../../components/stories";
import { clearPost, getAllPostSuccess, loadMorePost } from "../../redux/post";

// import { ref, listAll, getDownloadURL } from "firebase/storage";
// import { storage } from "../../firebase/config";

// const storiesData = [
//   {
//     id: 1,
//     name: "tptp.here",
//     source: require("../../assets/icon_avatar.png"),
//   },
// ];

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
    ></SafeAreaView>
  );
};

const Home = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const postData = useSelector((state) => state?.postState?.post);
  const user = useSelector((state) => state?.userState?.user?._id);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [updatedAt, setUpdatedAt] = useState("");

  const flatListRef = useRef();

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

  // useEffect(() => {

  //   if (isScrollToTop) {
  //     scrollToTop();
  //   }
  // }, [isScrollToTop, route]);

  // const getAllPosts = async () => {
  //   try {
  //     let query = "";
  //     const req = await getAllPostApi(query);
  //     if (req.success) {
  //       if (req.posts.length > 0) {
  //         const latedPost = req.posts[req.posts.length - 1];
  //         setUpdatedAt(latedPost.updatedAt);
  //         setIsEmpty(false);
  //         setIsFirstTime(false);

  //         dispatch(getAllPostSuccess(req.posts));
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
    console.log("Call API Refreshing");
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

  const scrollToTop = () => {
    setTimeout(() => {
      flatListRef.current.scrollToIndex({ animated: true, index: 0 });
    }, 200);
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
                      backgroundColor: "red",
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <Text>There is no feed for you!</Text>
                    </View>
                    <View>
                      <Text>There is no feed for you!</Text>
                    </View>
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
          <Footer navigation={navigation} isActive={0} />
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
