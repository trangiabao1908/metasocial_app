import { StyleSheet, View, Image, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

import { useNavigation } from "@react-navigation/native";
import ImageCustom from "./imageCustom";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";

const LeftHeader = ({ screen, data }) => {
  const navigation = useNavigation();
  const user = useSelector((state) => state?.userState?.user);

  return (
    <View style={styles.container}>
      {screen === "chat" && (
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="left"
              size={25}
              style={styles.iconLeft}
              color="#000"
              backgroundColor="#ffffff"
            />
          </TouchableOpacity>
          <Text style={styles.text}>{user?.username}</Text>
          <Icon name="down" size={13} />
        </View>
      )}

      {screen === "message" && (
        <Fragment>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="left"
              size={25}
              style={styles.iconLeft}
              color="#000"
              backgroundColor="#ffffff"
            />
          </TouchableOpacity>
          <View
            style={{
              marginLeft: 10,
            }}
          >
            <View
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <ImageCustom
                  style={{ width: 40, height: 40, marginRight: 10 }}
                  resizeMode="cover"
                  source={{
                    uri: `${
                      data?.userInfo.picturePath
                        ? data?.userInfo.picturePath
                        : "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"
                    }`,
                  }}
                  type="avatar"
                />
                <View>
                  <Text style={{ fontSize: 18, fontWeight: 600 }}>
                    {data?.userInfo.username}
                  </Text>
                  <Text
                    style={[
                      {
                        color: "rgb(115, 115, 115)",
                        fontWeight: 400,
                        fontSize: 12,
                      },
                    ]}
                  >
                    Hoạt động 8 phút trước
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Fragment>
      )}

      {screen === "viewProfile" && (
        <React.Fragment>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="left"
              size={25}
              style={styles.iconLeft}
              color="#000"
              backgroundColor="#ffffff"
            />
          </TouchableOpacity>
        </React.Fragment>
      )}
      {screen === "personal" && (
        <React.Fragment>
          <Text style={styles.text}>{user?.username}</Text>
          <Icon name="down" size={13} />
        </React.Fragment>
      )}

      {screen === "editPer" && (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="left"
            size={25}
            style={styles.iconLeft}
            color="#000"
            backgroundColor="#F5F7F9"
          />
        </TouchableOpacity>
      )}

      {screen === "Notification" && (
        <View style={[styles.container]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="left"
              size={25}
              style={[styles.iconLeft, { marginRight: 10 }]}
              color="#000"
              backgroundColor="#ffffff"
            />
          </TouchableOpacity>
          <Text style={styles.text}>Thông báo</Text>
        </View>
      )}
      {screen === "friend" && (
        <React.Fragment>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="left"
              size={25}
              style={styles.iconLeft}
              color="#000"
              backgroundColor="#ffffff"
            />
          </TouchableOpacity>
        </React.Fragment>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",

    // flex: 1,
  },
  text: {
    fontWeight: "bold",
    fontSize: 22,
    marginRight: 5,
  },
  iconLeft: {
    marginLeft: -5,
    marginRight: 5,
    // backgroundColor: "red",
  },
});

export default LeftHeader;
