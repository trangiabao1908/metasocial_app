import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect, memo } from "react";
import ImageCustom from "../../components/custom/imageCustom";
import Header from "../../components/search/header";
import Footer from "../../components/footer";
import { SafeAreaView } from "react-native-safe-area-context";
import { getListImagesApi, getPostByUserIdApi } from "../../api/postApi";
import { Video, ResizeMode } from "expo-av";
import useDebounce from "../../hook/hooks";
import Icon from "react-native-vector-icons/Entypo";
import { searchUserApi } from "../../api/userApi";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("screen").width;

const Search = () => {
  const [listImages, setListImages] = useState([]);
  const [updatedAt, setUpdatedAt] = useState("");

  const [refreshing, setRefreshing] = useState(false);
  const [invisible, setInvisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);

  const [isEmpty, setIsEmpty] = useState(false);

  const [isSearch, setIsSearch] = useState(false);

  const [q, setQ] = useState("");

  const [searchResult, setSearchResult] = useState([]);

  const debounceValue = useDebounce(q, 500);

  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(onRefresh, 200);
  }, []);

  useEffect(() => {
    handleSearchUser();
  }, [debounceValue]);

  const loadMoreData = async () => {
    console.log("Load more data");

    try {
      const req = await getListImagesApi(updatedAt);
      if (req.success) {
        if (req.posts.length > 0) {
          const latedPost = req.posts[req.posts.length - 1];
          setUpdatedAt(latedPost.updatedAt);
          setLoading(false);
          setListImages((prev) => [...prev, ...req.posts]);
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
    console.log("Call API Search Refreshing");
    try {
      let query = "";

      const req = await getListImagesApi(query);
      setInvisible(true);

      if (req.success) {
        if (req.posts.length > 0) {
          const latedPost = req.posts[req.posts.length - 1];
          setUpdatedAt(latedPost.updatedAt);
          setListImages(req.posts);
          setIsFirstTime(false);
          setInvisible(false);
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

  const onRefresh = () => {
    console.log("Refreshing");
    setIsEmpty(false);
    setTimeout(() => {
      setRefreshing(true);
      handleRefreshing();
    }, 200);
  };

  const handleEndReached = () => {
    console.log("test");
    if (!loading && !isEmpty && !isFirstTime) {
      console.log("reached");
      setLoading(true);
      setTimeout(() => loadMoreData(), 1000);
    }
  };

  const handleSearchUser = async () => {
    const req = await searchUserApi(debounceValue);
    if (req.success) {
      setSearchResult(req.users);
    }
  };

  const renderListImage = ({ item }) => {
    const handleGotoDetailPost = async () => {
      const postData = await getDataPost();

      navigation.navigate("DetailPost", { dataPersonal: postData });
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
            // marginRight: ,
          }}
        >
          <View
            style={{
              width: screenWidth / 3,
              height: 140,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {item.assets[0].type === "video" ? (
              <Video
                shouldPlay={true}
                source={{
                  uri: item.assets[0].url,
                }}
                style={{
                  height: 140,
                  aspectRatio: 1,
                  width: screenWidth / 3,
                }}
                resizeMode={ResizeMode.COVER}
              />
            ) : (
              <ImageCustom
                source={{ uri: item.assets[0]?.url }}
                resizeMode="cover"
                style={{ height: 140, aspectRatio: 1, width: screenWidth / 3 }}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
                <Text style={{ fontWeight: "bold" }}>{item.username}</Text>
              </View>
              <View
                style={{
                  marginLeft: 5,
                  marginBottom: 1,
                }}
              >
                <Text style={{ fontWeight: 400, color: "grey" }}>
                  {item?.displayName} <Icon name="dot-single" /> Bạn bè
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
          // debounceValue={debounceValue}
          setIsSearch={setIsSearch}
        />
      </View>
      <View style={styles.content}>
        {isSearch && (
          <FlatList
            key={1}
            data={searchResult}
            renderItem={renderSearchResults}
            keyExtractor={(item) => item._id}
            ListHeaderComponent={
              debounceValue && (
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
              )
            }
          />
        )}
        {!isSearch && !invisible && (
          <FlatList
            key={2}
            data={listImages}
            renderItem={renderListImage}
            keyExtractor={(item) => item._id}
            numColumns={3}
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
              loading && <ActivityIndicator size={"small"} />
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
