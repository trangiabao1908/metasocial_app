import {
  SafeAreaView,
  View,
  StyleSheet,
  StatusBar,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
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
import { EventRegister } from "react-native-event-listeners";
import { getPostByUserIdApi } from "../../api/postApi";
import Icon from "react-native-vector-icons/AntDesign";

const DetailPost = () => {
  const route = useRoute();
  const data = route?.params?.dataPersonal;
  const index = route?.params?.index;
  const userID = useSelector((state) => state.userState?.user?._id);
  const navigation = useNavigation();
  const [postData, setPostData] = useState();
  const flatListRef = useRef(null);
  const [hasScrolled, setHasScrolled] = useState(false);

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

  useEffect(() => {
    getDataPersonal();
    const eventListener = () => {
      EventRegister.addEventListener("onSuccessUpdatePost", getDataPersonal);
    };
    eventListener();
    return () => {
      EventRegister.removeEventListener("onSuccessUpdatePost", getDataPersonal);
    };
  }, [route]);

  useFocusEffect(
    useCallback(() => {
      let scrollToIndexPost;
      if (
        !hasScrolled &&
        postData?.length > 0 &&
        index >= 0 &&
        index < postData?.length
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
    }, [postData, hasScrolled])
  );

  const getDataPersonal = useCallback(async () => {
    let type = "viewProfile";
    let id = data[0].author._id;
    const req = await getPostByUserIdApi(id, type);
    if (req.success) {
      setPostData(req.data);
    }
  }, [route]);

  const scrollToIndex = () => {
    flatListRef.current.scrollToIndex({
      index: index,
      animated: true,
    });
  };

  const renderPosts = useCallback(({ item, index }) => {
    let isLike = item.like?.filter((data) => data.user === userID);

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
  });

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
            onEndReachedThreshold={0.1}
            ref={flatListRef}
          />
        </SafeAreaView>
      </View>

      <View style={style.footer}>
        <Footer navigation={navigation} />
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

const skeleton = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: "#e0e0e0",
    marginRight: 10,
  },
  postContent: {
    flex: 1,
  },
  skeleton: {
    backgroundColor: "#e0e0e0",
    height: 20,
  },
});

export default DetailPost;
