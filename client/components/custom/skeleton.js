import React from "react";
import { View, StyleSheet, Animated, Dimensions, Platform } from "react-native";

const PostSkeleton = () => {
  const widthValue = new Animated.Value(100);
  const screenWidth = Dimensions.get("window").width;

  Animated.loop(
    Animated.timing(widthValue, {
      toValue: 200,
      duration: screenWidth,
      useNativeDriver: false,
    })
  ).start();

  return (
    <View style={styles.container}>
      <View style={styles.postContent}>
        <View
          style={[
            styles.avatar,
            {
              width: 60,
              height: 60,
              borderRadius: 360,
              marginRight: 20,
              marginBottom: 10,
            },
          ]}
        />
        <View
          style={[
            styles.avatar,
            { width: 60, height: 60, borderRadius: 360, marginRight: 20 },
          ]}
        />
        <View
          style={[
            styles.avatar,
            { width: 60, height: 60, borderRadius: 360, marginRight: 20 },
          ]}
        />
      </View>
      <View style={styles.postContent}>
        <View
          style={[
            styles.avatar,
            { width: 35, height: 35, borderRadius: 360, marginRight: 10 },
          ]}
        />
        <View>
          <View style={[styles.skeleton, { width: 100 }]} />
        </View>
      </View>
      <View style={{ width: screenWidth, height: 300 }}>
        <View style={[styles.rectangle]} />
      </View>

      <View style={[styles.postContent, { marginTop: 25 }]}>
        <View
          style={[
            styles.avatar,
            { width: 35, height: 35, borderRadius: 360, marginRight: 10 },
          ]}
        />
        <View>
          <View style={[styles.skeleton, { width: 100 }]} />
        </View>
      </View>
      <View style={{ width: screenWidth, height: 300 }}>
        <View style={[styles.rectangle]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    marginBottom: 20,
    marginTop: Platform.OS === "ios" ? 0 : 40,
  },
  avatar: {
    backgroundColor: "#e0e0e0",
  },
  postContent: {
    marginHorizontal: 15,
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  skeleton: {
    backgroundColor: "#e0e0e0",
    height: 15,
  },
  rectangle: {
    backgroundColor: "#e0e0e0",
    height: 180,
    flex: 1,
  },
});

export default PostSkeleton;
