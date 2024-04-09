import {
  StyleSheet,
  View,
  FlatList,
  SafeAreaView,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import Icon4 from "react-native-vector-icons/Octicons";
import Icon2 from "react-native-vector-icons/Feather";

import ImageCustom from "../custom/imageCustom";
import { Fragment, useState, useRef, useCallback, memo } from "react";
import PagerView from "react-native-pager-view";
import { Video, ResizeMode } from "expo-av";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { ImageBackground } from "expo-image";

const screenWidth = Dimensions.get("screen").width;
const SkeletonItem = memo(() => {
  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: 2,
      }}
    >
      <TouchableOpacity>
        <View
          style={{
            width: screenWidth / 3,
            height: 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#e0e0e0",
          }}
        >
          <ActivityIndicator
            size={"small"}
            color={"999999"}
          ></ActivityIndicator>
        </View>
      </TouchableOpacity>
    </View>
  );
});
const BookMarks = memo(({ item, index }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: 2,
      }}
    >
      <TouchableOpacity>
        <View
          style={{
            width: screenWidth / 3,
            height: 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {item.post.assets[0].type === "video" ? (
            <Video
              shouldPlay={false}
              source={{
                uri: item.post.assets[0]?.url,
              }}
              style={{
                height: 140,
                aspectRatio: 1,
                width: screenWidth / 3,
              }}
              resizeMode={ResizeMode.COVER}
            />
          ) : item?.post?.assets[0]?.notSafe === true ? (
            <ImageBackground
              source={{ uri: item.post?.assets[0]?.url }}
              style={{ height: 140, width: screenWidth / 3 }}
              blurRadius={80}
            />
          ) : (
            <ImageCustom
              source={{ uri: item.post.assets[0]?.url }}
              resizeMode="cover"
              style={{ height: 140, aspectRatio: 1, width: screenWidth / 3 }}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
});

const ListImagePerson = memo(({ item, index, handleViewAllPost }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: 2,
      }}
    >
      <TouchableOpacity onPress={() => handleViewAllPost(index)}>
        <View
          style={{
            width: screenWidth / 3,
            height: 140,
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
                height: 140,
                aspectRatio: 1,
                width: screenWidth / 3,
              }}
              resizeMode={ResizeMode.COVER}
            />
          ) : item?.assets[0].notSafe === true ? (
            <ImageBackground
              source={{ uri: item.assets[0]?.url }}
              style={{
                height: 140,
                width: screenWidth / 3,
              }}
              blurRadius={80}
            />
          ) : (
            <ImageCustom
              source={{ uri: item.assets[0]?.url }}
              resizeMode="cover"
              style={{
                height: 140,
                aspectRatio: 1,
                width: screenWidth / 3,
              }}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
});

const Paper = ({ dataPersonal }) => {
  const [selectIcon, setSelectIcon] = useState(0);
  const ref = useRef(null);
  const navigation = useNavigation();

  const route = useRoute();
  const authorId = route.params?.authorID;
  const bookmarks = useSelector((state) => state?.bookmarkState?.bookmark);
  const userID = useSelector((state) => state.userState?.user._id);
  const [flatListRendered, setFlatListRendered] = useState(false);
  const handleSelectedPage = (pageNumber) => {
    setSelectIcon(pageNumber);
    if (pageNumber === 2 && !flatListRendered) {
      setFlatListRendered(true);
    }
  };

  const goToPage = (pageNumber) => {
    if (ref.current) {
      ref.current.setPage(pageNumber);
    }
  };

  const handleViewAllPost = (i) => {
    navigation.navigate("DetailPost", { dataPersonal, index: i });
  };

  const renderListImage = useCallback(
    ({ item, index }) => {
      let i = index;

      return (
        <ListImagePerson
          item={item}
          index={i}
          handleViewAllPost={handleViewAllPost}
        />
      );
    },
    [dataPersonal]
  );

  const renderListBookMarks = useCallback(({ item, index }) => {
    let i = index;
    return <BookMarks item={item} index={i} />;
  }, []);

  return (
    <Fragment>
      <View style={[styles.flexRow, { marginTop: 20 }]}>
        <View style={[styles.icon, selectIcon === 0 && styles.active]}>
          <Icon.Button
            name="table"
            size={25}
            color="#000"
            backgroundColor="#ffffff"
            iconStyle={{
              marginRight: 0,
            }}
            onPress={() => goToPage(0)}
          />
        </View>
        <View style={[styles.icon, selectIcon === 1 && styles.active]}>
          <Icon4.Button
            name="video"
            size={25}
            color="#000"
            backgroundColor="#ffffff"
            iconStyle={{
              marginRight: 0,
            }}
            onPress={() => goToPage(1)}
          />
        </View>
        <View style={[styles.icon, selectIcon === 2 && styles.active]}>
          <Icon.Button
            name="tago"
            size={25}
            color="#000"
            backgroundColor="#ffffff"
            iconStyle={{
              marginRight: 0,
            }}
            onPress={() => goToPage(2)}
          />
        </View>
      </View>

      <PagerView
        style={{ flex: 1 }}
        initialPage={0}
        ref={ref}
        onPageSelected={(e) => handleSelectedPage(e.nativeEvent.position)}
      >
        <SafeAreaView
          style={{
            display: "flex",
            marginTop: 1,
            flexDirection: "column",
          }}
        >
          {dataPersonal.length > 0 && (
            <FlatList
              data={dataPersonal}
              renderItem={renderListImage}
              keyExtractor={(item) => item._id}
              numColumns={3}
              initialScrollIndex={0}
              initialNumToRender={9}
              maxToRenderPerBatch={6}
              removeClippedSubviews={true}
              windowSize={9}
              contentContainerStyle={styles.flatListContentContainer}
            />
          )}
          {authorId !== userID && dataPersonal.length <= 0 && (
            <View
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                marginHorizontal: 25,
                marginBottom: 65,
              }}
            >
              <View
                style={{
                  marginTop: 40,
                }}
              >
                <Icon2 name="image" size={50} />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: 15,
                  }}
                >
                  Người dùng chưa đăng bài
                </Text>
              </View>
            </View>
          )}
          {authorId == userID && dataPersonal.length <= 0 && (
            <View
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                marginHorizontal: 25,
                marginBottom: 65,
              }}
            >
              <View
                style={{
                  marginTop: 40,
                }}
              >
                <Icon2 name="image" size={50} />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: 15,
                  }}
                >
                  Bạn chưa đăng bài viết nào
                </Text>
              </View>
            </View>
          )}
        </SafeAreaView>

        <View
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginHorizontal: 25,
          }}
        >
          <View style={{ marginTop: 40 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 15,
              }}
            >
              Chia sẻ khoảnh khắc với tất cả mọi người
            </Text>
          </View>
          <View>
            <Text
              style={{ color: "#3399FF", fontWeight: 500, textAlign: "center" }}
            >
              Tạo thước phim đầu tiên
            </Text>
          </View>
        </View>

        <SafeAreaView
          style={{
            display: "flex",
            marginTop: 1,
            flexDirection: "column",
          }}
        >
          {authorId === userID && bookmarks?.length > 0 && flatListRendered ? (
            <FlatList
              data={bookmarks}
              renderItem={renderListBookMarks}
              keyExtractor={(item) => item._id}
              numColumns={3}
              initialScrollIndex={0}
              initialNumToRender={6}
              maxToRenderPerBatch={6}
              removeClippedSubviews={true}
              windowSize={6}
              contentContainerStyle={styles.flatListContentContainer}
            />
          ) : (
            authorId === userID &&
            bookmarks?.length > 0 && (
              <FlatList
                data={bookmarks}
                renderItem={() => <SkeletonItem></SkeletonItem>}
                keyExtractor={(item) => item._id}
                numColumns={3}
                initialScrollIndex={0}
                initialNumToRender={6}
                maxToRenderPerBatch={6}
                removeClippedSubviews={true}
                windowSize={6}
                contentContainerStyle={styles.flatListContentContainer}
              />
            )
          )}
          {bookmarks?.length <= 0 && (
            <View
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                marginHorizontal: 25,
              }}
            >
              <View
                style={{
                  marginTop: 40,
                }}
              >
                <Icon2 name="bookmark" size={50} />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: 15,
                  }}
                >
                  Bắt đầu lưu
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: "grey",
                    fontWeight: 500,
                    textAlign: "center",
                    opacity: 0.7,
                    marginBottom: 15,
                  }}
                >
                  Các bài viết và những thước phim đã lưu sẽ được hiển thị ở
                  đây.
                </Text>
              </View>
            </View>
          )}
          {authorId !== userID && (
            <View
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                marginHorizontal: 25,
              }}
            >
              <View
                style={{
                  marginTop: 40,
                }}
              >
                <Icon2 name="bookmark" size={50} />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: 15,
                  }}
                >
                  Bạn không thể xem
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: "grey",
                    fontWeight: 500,
                    textAlign: "center",
                    opacity: 0.7,
                    marginBottom: 15,
                  }}
                >
                  Các bài viết và những thước phim đã lưu đang ở chế độ riêng
                  tư.
                </Text>
              </View>
            </View>
          )}
        </SafeAreaView>
      </PagerView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  flexRow: {
    display: "flex",
    flexDirection: "row",
  },

  icon: {
    display: "flex",
    flex: 1,
    alignItems: "center",
  },
  active: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
});

export default Paper;
