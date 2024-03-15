import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  View,
  Platform,
} from "react-native";

import { useState, useEffect } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as ImagePicker from "expo-image-picker";
import { useRoute } from "@react-navigation/native";

const dataRender = [
  {
    id: 1,
    text: "Camera",
    icon: "camera-retro",
    color: "#2ca5ff",
    takePicture: true,
  },
  {
    id: 2,
    text: "Ảnh / Video",
    icon: "images",
    color: "#8fce00",
    pickImage: true,
  },
  {
    id: 3,
    text: "Cảm xúc / Hoạt động",
    icon: "grin",
    color: "#f1c232",
  },
  {
    id: 4,
    text: "Check in",
    icon: "map-marker-alt",
    color: "#f53434",
  },
  {
    id: 5,
    text: "Video trực tiếp",
    icon: "video",
    color: "#c90076",
  },
  {
    id: 6,
    text: "Màu nền",
    icon: "font",
    color: "#f6b26b",
  },
];

const FooterPost = ({
  isFocus,
  setSelectedImages,
  setIsFocus,
  setFieldValue,
  setIsNew,
}) => {
  const route = useRoute();
  const type = route?.params.type;

  useEffect(() => {
    if (type === "update") {
      const data = route?.params.dataUpdate[0];
      setIsFocus(true);
      setSelectedImages(data.assets);
    }
  }, [route]);

  const imageUpload = 4;

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === "granted";
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
      multiple: true, // Allow selecting multiple images
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      // console.log(result.assets);
      if (result.assets.length > imageUpload) {
        Alert.alert(`You can only select up to ${imageUpload} images.`);
        return;
      }
      let data = [];

      result.assets.map((item) => {
        data.push({
          assetId: item.assetId,
          type: item.type,
          fileName: item.fileName,
          uri:
            Platform.OS === "ios" ? item.uri.replace("file://", "") : item.uri,
        });
      });

      setIsFocus(true);
      setSelectedImages(result.assets);
      setFieldValue("image", data);
      setIsNew(true);
    }
  };

  const takePicture = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        let data = [];
        result.assets.map((item) => {
          data.push({
            type: item.type,
            uri:
              Platform.OS === "ios"
                ? item.uri.replace("file://", "")
                : item.uri,
          });
        });
        setIsFocus(true);
        setSelectedImages(result.assets);
        setFieldValue("image", data);
        setIsNew(true);
      }
    }
  };

  const renderItem = (item) => (
    <TouchableOpacity
      style={styles.content}
      key={item.id}
      onPress={
        (item.pickImage && pickImage) || (item.takePicture && takePicture)
      }
    >
      <View style={[isFocus ? styles.icon : styles.flex_1]}>
        <FontAwesome5 name={item.icon} size={25} color={item.color} />
      </View>
      {!isFocus && (
        <View style={styles.wrapText}>
          <Text style={[styles.text]}>{item.text}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        Platform.OS === "ios" ? styles.shadowIOS : styles.shadowAndroid,
        {
          paddingBottom: 30,
          borderTopLeftRadius: 26,
          borderTopRightRadius: 26,
        },
      ]}
    >
      <View style={styles.centeredBox}>
        <View
          style={{
            width: 40,
            height: 5,
            backgroundColor: "grey",
            borderRadius: 8,
            opacity: 0.2,
          }}
        ></View>
      </View>
      <View
        style={[
          styles.flex,
          isFocus && {
            flexDirection: "row",
            justifyContent: "space-around",
          },
        ]}
      >
        {dataRender.map((item) => renderItem(item))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  flex: {
    display: "flex",
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  icon: {
    display: "flex",
  },
  flex_1: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: 400,
  },
  wrapText: {
    flex: 6,
    display: "flex",
  },
  shadowIOS: {
    shadowColor: "black",
    backgroundColor: "white",
    shadowOpacity: 0.3,
  },
  shadowAndroid: {
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default FooterPost;
