import { useNavigation } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "react-native-vector-icons/AntDesign";
import { getListImagesApi, getPostByUserIdApi } from "../../api/postApi";
import { searchUserApi } from "../../api/userApi";
import ImageCustom from "../../components/custom/imageCustom";
import Footer from "../../components/footer";
import Header from "../../components/search/header";
import useDebounce from "../../hook/hooks";
import { useSelector, useDispatch } from "react-redux";
import { clearImage, getAllImage, loadMoreImage } from "../../redux/image";
import { EventRegister } from "react-native-event-listeners";
import { ImageBackground } from "expo-image";

const screenWidth = Dimensions.get("screen").width;

const Search = () => {
  // const [updatedAt, setUpdatedAt] = useState("");

  const [refreshing, setRefreshing] = useState(false);
  const [invisible, setInvisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const [isEmpty, setIsEmpty] = useState(true);

  const [isSearch, setIsSearch] = useState(false);

  const [q, setQ] = useState("");

  const [searchResult, setSearchResult] = useState([]);

  const [isFirstTime, setIsFirstTime] = useState(true);

  const debounceValue = useDebounce(q, 500);

  const navigation = useNavigation();

  const dispatch = useDispatch();

  const listImage = useSelector((state) => state.imageState?.list);

  useEffect(() => {
    if (listImage.length <= 0) {
      setTimeout(onRefresh, 200);
    }
    const eventListener = () => {
      onRefresh();
    };
    EventRegister.addEventListener("updateSearch", eventListener);
    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  }, []);

  useEffect(() => {
    if (isSearch) {
      handleSearchUser();
    }
  }, [debounceValue]);

  const loadMoreData = async () => {
    console.log("Load more data");

    try {
      let updated = listImage[listImage.length - 1].updatedAt;
      const req = await getListImagesApi(updated);
      if (req.success) {
        if (req.posts.length > 0) {
          const allExist = listImage.every((item1) =>
            req.posts.map((item2) => item2._id).includes(item1._id)
          );
          if (!allExist) {
            dispatch(loadMoreImage(req.posts));
          }
          if (req.isLastElement) {
            setIsEmpty(true);
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshing = async () => {
    console.log("Call API Search Refreshing");
    try {
      let query = "";

      dispatch(clearImage());
      const req = await getListImagesApi(query);
      setInvisible(true);

      if (req.success) {
        if (req.posts.length > 0) {
          dispatch(getAllImage(req.posts));
          setInvisible(false);
        }

        if (req.isLastElement) {
          console.log(req.isLastElement);
          setIsEmpty(true);
        }
        setRefreshing(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onRefresh = () => {
    setIsEmpty(false);
    setTimeout(() => {
      setRefreshing(true);
      handleRefreshing();
    }, 200);
  };

  const handleEndReached = () => {
    console.log("reached");
    if (!loading && !isEmpty && !refreshing) {
      console.log("reached Call API");

      setLoading(true);
      setTimeout(() => loadMoreData(), 1000);
    }
  };

  const handleSearchUser = async () => {
    setIsLoadingSearch(true);
    const req = await searchUserApi(debounceValue);
    if (req.success) {
      setSearchResult(req.users);
      setIsLoadingSearch(false);
    }
  };

  const renderListImage = useCallback(({ item, index }) => {
    const handleGotoDetailPost = async () => {
      const postData = await getDataPost();
      const indexToScroll = postData.findIndex(
        (element) => item._id === element._id
      );
      navigation.navigate("DetailPost", {
        dataPersonal: postData,
        index: indexToScroll,
      });
    };
    const getDataPost = async () => {
      let type = "viewProfile";
      let id = item.author._id;
      const req = await getPostByUserIdApi(id, type);
      if (req.success) {
        return req.data;
      }
    };

    return (
      <TouchableOpacity onPress={handleGotoDetailPost}>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 2,
          }}
        >
          <View
            style={{
              width: screenWidth / 3,
              height: screenWidth / 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {item?.assets[0].type === "video" ? (
              <Video
                shouldPlay={false}
                source={{
                  uri: item.assets[0].url,
                }}
                style={{
                  height: screenWidth / 3,
                  aspectRatio: 1,
                  width: screenWidth / 3,
                }}
                resizeMode={ResizeMode.COVER}
              />
            ) : item?.assets[0].notSafe === true ? (
              <ImageBackground
                source={{ uri: item.assets[0]?.url }}
                style={{
                  height: screenWidth / 3,
                  width: screenWidth / 3,
                }}
                blurRadius={80}
              />
            ) : (
              <ImageCustom
                source={{ uri: item.assets[0]?.url }}
                resizeMode="cover"
                style={{
                  height: screenWidth / 3,
                  aspectRatio: 1,
                  width: screenWidth / 3,
                }}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }, []);

  const renderHeader = useCallback(() => {
    if (debounceValue) {
      return (
        <View
          style={{
            marginHorizontal: 20,
            paddingVertical: 10,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={styles.wrapIcon}>
            <AntDesign name="search1" size={20} color="black" />
          </View>
          <View>
            <Text>{debounceValue}</Text>
          </View>
        </View>
      );
    }
    return null;
  }, [isLoadingSearch]);

  const renderSearchResults = ({ item }) => {
    const handleGotoDetails = () => {
      navigation.navigate("Personal", {
        type: "viewProfile",
        authorID: item._id,
      });
    };
    return (
      <TouchableOpacity onPress={handleGotoDetails}>
        <View
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
              marginLeft: 20,
              width: "65%",
            }}
          >
            <ImageCustom
              resizeMode="cover"
              style={{ width: 45, height: 45 }}
              type={"avatar"}
              source={{
                uri: item.picturePath,
              }}
            />
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: 5,
                flexWrap: "wrap",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  marginLeft: 5,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>{item?.username}</Text>
              </View>
              <View
                style={{
                  marginLeft: 5,
                  marginBottom: 1,
                }}
              >
                <Text style={{ fontWeight: 400, color: "grey" }}>
                  {item?.displayName}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Header
          q={q}
          setQ={setQ}
          isSearch={isSearch}
          setIsSearch={setIsSearch}
        />
      </View>
      <View style={styles.content}>
        {isSearch && !isLoadingSearch && (
          <FlatList
            key={1}
            data={searchResult}
            renderItem={renderSearchResults}
            keyExtractor={(item) => item?._id}
            ListHeaderComponent={renderHeader}
          />
        )}
        {isLoadingSearch && isSearch && debounceValue && <ActivityIndicator />}
        {!isSearch && !invisible && (
          <FlatList
            key={2}
            data={listImage && listImage}
            renderItem={renderListImage}
            keyExtractor={(item) => item?._id}
            numColumns={3}
            maxToRenderPerBatch={6}
            windowSize={13}
            removeClippedSubviews={true}
            onEndReachedThreshold={0.2}
            scrollEventThrottle={16}
            onEndReached={handleEndReached}
            refreshControl={
              <RefreshControl
                style={{ transform: [{ scale: 0.6 }] }}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            ListFooterComponent={
              loading && (
                <ActivityIndicator
                  size={"small"}
                  style={{ marginVertical: 10 }}
                />
              )
            }
          />
        )}
      </View>
      <View style={styles.footer}>
        <Footer navigation={navigation} isActive={1} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "white",
    flex: 1,
  },
  header: {
    marginTop: 10,
    padding: 0,
  },
  content: {
    flex: 1,
    marginTop: 10,
  },
  wrapIcon: {
    display: "flex",
    justifyContent: "center",
    padding: 10,
    marginRight: 10,
    borderWidth: 0.5,
    borderColor: "grey",
    borderRadius: 360,
    width: 45,
    height: 45,
    alignItems: "center",
  },
  footer: {
    borderTopColor: "rgb(219, 219, 219)",
    borderTopWidth: 0.5,
  },
});

export default Search;
