import { SafeAreaView, View, StyleSheet, Text, Image } from "react-native";

import React, { memo } from "react";

import ImageCustom from "./custom/imageCustom";

const ListStories = ({ source, name, id }) => {
  return (
    <View style={stories.container} key={id}>
      <View style={stories.flexItem}>
        <View style={stories.content2}>
          <ImageCustom
            style={{ width: 50, height: 50 }}
            resizeMode="cover"
            type="avatar"
            source={source}
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
            source={source}
            type="avatar"
          />
        </View>
        <Text style={stories.center}>{name}</Text>
      </View>
      <View style={stories.flexItem}>
        <View style={stories.content2}>
          <ImageCustom
            style={{ width: 70, height: 70 }}
            resizeMode="cover"
            source={source}
            type="avatar"
          />
        </View>
        <Text style={stories.center}>{name}</Text>
      </View>
      <View style={stories.flexItem}>
        <View style={stories.content2}>
          <ImageCustom
            style={{ width: 70, height: 70 }}
            resizeMode="cover"
            source={source}
            type="avatar"
          />
        </View>
        <Text style={stories.center}>{name}</Text>
      </View>
      <View style={stories.flexItem}>
        <View style={stories.content2}>
          <ImageCustom
            style={{ width: 70, height: 70 }}
            resizeMode="cover"
            source={source}
            type="avatar"
          />
        </View>
        <Text style={stories.center}>{name}</Text>
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
    borderColor: "#e0e0e0",
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
  },
});

export default memo(ListStories);
