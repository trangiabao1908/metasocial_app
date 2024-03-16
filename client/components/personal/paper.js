import {
  StyleSheet,
  View,
  FlatList,
  SafeAreaView,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import Icon4 from "react-native-vector-icons/Octicons";
import Icon2 from "react-native-vector-icons/EvilIcons";

import ImageCustom from "../custom/imageCustom";
import { Fragment, useState, useRef, useEffect } from "react";
import PagerView from "react-native-pager-view";
import { Video, ResizeMode } from "expo-av";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("screen").width;

const Paper = ({ dataPersonal }) => {
  const [selectIcon, setSelectIcon] = useState(0);
  const ref = useRef(null);
  const navigation = useNavigation();

  const handleSelectedPage = (pageNumber) => {
    setSelectIcon(pageNumber);
  };

  const goToPage = (pageNumber) => {
    if (ref.current) {
      ref.current.setPage(pageNumber);
    }
  };

  const handleViewAllPost = (i) => {
    navigation.navigate("DetailPost", { dataPersonal, index: i });
  };

  const renderListImage = ({ item, index }) => {
    let i = index;

    return (
      <View
        style={{
          flexDirection: "row",
          marginBottom: 2,
        }}
      >
        <TouchableOpacity onPress={() => handleViewAllPost(i)}>
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
            ) : (
              <ImageCustom
                source={{ uri: item.assets[0]?.url }}
                resizeMode="cover"
                style={{ height: 140, aspectRatio: 1, width: screenWidth / 3 }}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

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
          {dataPersonal && (
            <FlatList
              data={dataPersonal}
              renderItem={renderListImage}
              keyExtractor={(item) => item._id}
              numColumns={3}
              initialScrollIndex={0}
              contentContainerStyle={styles.flatListContentContainer}
            />
          )}
        </SafeAreaView>

        <View
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginHorizontal: 25,

            // backgroundColor: "red",
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

        <View
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 25,
            // backgroundColor: "red",
          }}
        >
          <View
            style={{
              marginBottom: 15,
            }}
          >
            <Icon2 name="user" size={100} />
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
              Ảnh và video có mặt bạn
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
              Ảnh và video mọi người gắn thẻ bạn sẽ hiển thị ở đây
            </Text>
          </View>
        </View>
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
