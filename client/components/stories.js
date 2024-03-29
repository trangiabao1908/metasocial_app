import { StyleSheet, Text, View } from "react-native";

import React, { memo } from "react";

import ImageCustom from "./custom/imageCustom";

const ListStories = () => {
  return (
    <View style={stories.container}>
      <View style={stories.flexItem}>
        <View style={[stories.content2]}>
          <ImageCustom
            style={{ width: 70, height: 70 }}
            resizeMode="cover"
            type="avatar"
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/meta-social-app-db279.appspot.com/o/6528efdc09df8502aff05b64%2Favatar%2Fimage%2F1710443961624?alt=media&token=9a7a8ec6-707b-4d1f-9324-a1b3865386fb",
            }}
          />
        </View>
        <Text style={stories.center}>Tin của bạn</Text>
      </View>
      <View style={{ width: 10 }}></View>

      <View style={stories.flexItem}>
        <View style={stories.content2}>
          <ImageCustom
            style={{ width: 70, height: 70 }}
            resizeMode="cover"
            source={{
              uri: "https://stcv4.hnammobile.com/downloads/a/cach-chup-anh-selfie-dep-an-tuong-ban-nhat-dinh-phai-biet-01675319564.jpg",
            }}
            type="avatar"
          />
        </View>
        <Text style={stories.center}>thangdayne</Text>
      </View>
      <View style={stories.flexItem}>
        <View style={stories.content2}>
          <ImageCustom
            style={{ width: 70, height: 70 }}
            resizeMode="cover"
            source={{
              uri: "https://cdn.tuoitre.vn/thumb_w/640/471584752817336320/2023/2/15/profil-drama-bae-suzy-1676431911465251310134.jpg",
            }}
            type="avatar"
          />
        </View>
        <Text style={stories.center}>baesuzyyy</Text>
      </View>
      <View style={stories.flexItem}>
        <View style={stories.content2}>
          <ImageCustom
            style={{ width: 70, height: 70 }}
            resizeMode="cover"
            source={{
              uri: "https://kenh14cdn.com/203336854389633024/2024/3/16/photo-8-17105643905701131455591.jpg",
            }}
            type="avatar"
          />
        </View>
        <Text style={stories.center}>hansohee</Text>
      </View>

      <View style={stories.flexItem}>
        <View style={stories.content2}>
          <ImageCustom
            style={{ width: 70, height: 70 }}
            resizeMode="cover"
            source={{
              uri: "https://i.pinimg.com/originals/b0/43/44/b04344eb93a6f7404344ab4d10939607.png",
            }}
            type="avatar"
          />
        </View>
        <Text style={stories.center}>jennie_kim</Text>
      </View>
    </View>
  );
};

const stories = StyleSheet.create({
  // CSS Stories
  container: {
    display: "flex",
    marginLeft: 15,
    marginRight: 15,
    flexDirection: "row",
    // backgroundColor: "red",
    height: 120,
  },
  content2: {
    display: "flex",
    justifyContent: "center",
    height: 75,
    width: 75,
    alignItems: "center",
    borderRadius: 360,
    borderColor: "rgb(246,43,147)",
    borderWidth: 1,
  },
  flexItem: {
    display: "flex",
    justifyContent: "center",
    marginRight: 15,
    // backgroundColor: "blue",
  },

  center: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 12,
  },
});

export default memo(ListStories);
