import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/Feather";
import Icon3 from "react-native-vector-icons/Entypo";
import Icon4 from "react-native-vector-icons/FontAwesome";
import Icon5 from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import ImageCustom from "./custom/imageCustom";
import { SafeAreaView } from "react-native-safe-area-context";

const Footer = ({ navigation, isActive, handleClick }) => {
  const user = useSelector((state) => state?.userState.user);
  handleNavigateCreatePost = useCallback(() => {
    console.log("aha");
    navigation.navigate("Post", { type: "post", data: {} });
  }, []);

  return (
    <SafeAreaView
      style={styles.icon}
      edges={["right", "left", Platform.OS === "ios" ? "" : "bottom"]}
    >
      {isActive === 0 ? (
        <Icon3.Button
          name="home"
          size={25}
          color="#000"
          backgroundColor="#ffffff"
          onPress={handleClick}
          iconStyle={{
            marginRight: 0,
          }}
        />
      ) : (
        <Icon2.Button
          name="home"
          size={25}
          color="#000"
          backgroundColor="#ffffff"
          iconStyle={{
            marginRight: 0,
          }}
          onPress={() => {
            navigation.navigate("Home");
          }}
        />
      )}
      {isActive === 1 ? (
        <Icon4.Button
          name="search"
          size={25}
          color="#000"
          backgroundColor="#ffffff"
          iconStyle={{
            marginRight: 0,
          }}
          onPress={() => navigation.navigate("Search")}
        />
      ) : (
        <Icon2.Button
          name="search"
          size={25}
          color="#000"
          backgroundColor="#ffffff"
          iconStyle={{
            marginRight: 0,
            fontWeight: "bold",
          }}
          onPress={() => navigation.navigate("Search")}
        />
      )}
      <Icon.Button
        name="pluscircleo"
        size={25}
        color="#000"
        backgroundColor="#ffffff"
        iconStyle={{
          marginRight: 0,
        }}
        onPress={handleNavigateCreatePost}
      />
      <Icon2.Button
        name="users"
        size={25}
        color="#000"
        backgroundColor="#ffffff"
        iconStyle={{
          marginRight: 0,
        }}
        onPress={() => navigation.navigate("Friend")}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate("Personal", { type: "personal" })}
      >
        <View>
          <View
            style={{
              borderColor: isActive === 4 ? "black" : "#EAEAEA",
              borderWidth: isActive === 4 ? 2 : 1,
              borderRadius: 360,
              height: 30,
              width: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ImageCustom
              style={{ width: 25, height: 25 }}
              resizeMode="cover"
              type="avatar"
              source={{
                uri: user?.picturePath,
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  icon: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 7,
  },
});

export default Footer;
