import {
  SafeAreaView,
  View,
  StyleSheet,
  StatusBar,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import Footer from "../../components/footer";
import Post from "../../components/detail/post";
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { useSelector } from "react-redux";

import Icon from "react-native-vector-icons/AntDesign";
const DetailPost = () => {
  const route = useRoute();
  const data = route?.params?.dataPersonal;
  const index = route?.params?.index;
  const userID = useSelector((state) => state.userState?.user?._id);
  const navigation = useNavigation();
  const startIndex = 0;
  const [currentStartIndex, setCurrentStartIndex] = useState(index - 4);
  const [currentIndex, setCurrentIndex] = useState(index + 3);

  const [postData, setPostData] = useState(
    index === 0
      ? data.slice(startIndex, startIndex + 3)
      : data.slice(index - 1, index + 3)
  );

  const flatListRef = useRef(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isEmpty, setIsEmpty] = useState(index === 0 ? true : false);
  console.log({ currentIndex });

  // const [data, setData] = useState(data)

  // useEffect(() => {
  //   console.log("useEffect");
  //   console.log(index);
  //   if (index >= 0) {
  //     console.log({ index });
  //     const newData = data.slice(index, index + 10);

  //     setPostData(newData);
  //     setCurrentIndex(index);
  //   }
  // }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "center",
      headerTitle: () => (
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Text>{data[0].author.username}</Text>
          <Text style={{ marginRight: 5, fontSize: 16, fontWeight: "bold" }}>
            Bài viết
          </Text>
        </View>
      ),
      headerLeft: () =>
        Platform.OS === "ios" ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="left"
              color="black"
              iconStyle={{
                marginRight: 0,
              }}
              size={25}
            />
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, route]);

  // useEffect(() => {
  //   // getDataPersonal();
  //   const eventListener = () => {
  //     EventRegister.addEventListener("onSuccessUpdatePost", getDataPersonal);
  //   };
  //   eventListener();
  //   return () => {
  //     EventRegister.removeEventListener("onSuccessUpdatePost", getDataPersonal);
  //   };
  // }, [route]);

  useFocusEffect(
    useCallback(() => {
      let scrollToIndexPost;
      if (
        !hasScrolled &&
        data?.length > 0 &&
        index >= 0 &&
        index < data?.length
      ) {
        scrollToIndexPost = setTimeout(() => {
          setHasScrolled(true);
          scrollToIndex();
        }, 200);
      }
      return () => {
        if (scrollToIndexPost) {
          clearTimeout(scrollToIndexPost);
        }
      };
    }, [data, hasScrolled])
  );

  const handleScroll = (event) => {
    console.log("scroll");
    const offsetY = event.nativeEvent.contentOffset.y;

    setTimeout(() => {
      if (!isEmpty) {
        if (currentStartIndex > 0 && offsetY < 10) {
          console.log("> 0");
          const newData = data.slice(currentStartIndex, currentStartIndex + 3);
          setPostData((prev) => [...newData, ...prev]);
          setCurrentStartIndex(currentStartIndex - 3);
        }
        if (currentStartIndex <= 0) {
          const newData = data.slice(startIndex, currentStartIndex + 3);
          setPostData((prev) => [...newData, ...prev]);
          setCurrentStartIndex(null);
          setIsEmpty(true);
        }
      }
    }, 500);
  };

  const scrollToIndex = () => {
    flatListRef.current.scrollToIndex({
      index: index === 0 ? 0 : 1,
      animated: true,
    });
  };

  const handleEndReached = () => {
    console.log("Reached End");
    const newData = data.slice(currentIndex, currentIndex + 3);
    setPostData((prev) => [...prev, ...newData]);
    setCurrentIndex(currentIndex + 3);
  };

  const renderPosts = useCallback(
    ({ item, index }) => {
      let isLike = item.like?.filter((data) => data.user === userID);

      const isLiked = isLike && isLike.length > 0;

      return (
        <Post
          id={item._id}
          author={item.author}
          title={item.title}
          assets={item.assets}
          like={item.like}
          comment={item.comment}
          isLike={isLiked}
          updatedAt={item.createdAt}
          disableComment={item.disableComment}
          setPostData={setPostData}
          data={postData}
        />
      );
    },
    [postData, data]
  );

  return (
    <SafeAreaView style={style.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={style.content}>
        <SafeAreaView>
          <FlatList
            data={postData}
            renderItem={renderPosts}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onEndReachedThreshold={0.4}
            onEndReached={handleEndReached}
            ref={flatListRef}
            onMomentumScrollEnd={handleScroll}
          />
        </SafeAreaView>
      </View>
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
  loading: {
    position: "absolute",
    top: "12%",
    left: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
  },
});

export default DetailPost;
