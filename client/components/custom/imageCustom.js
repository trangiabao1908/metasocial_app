import { StyleSheet } from "react-native";
import { Image } from "expo-image";

function ImageCustom({ style, source, resizeMode, type }) {
  return (
    <Image
      style={[
        type === "avatar"
          ? styles.avatar
          : type === "image"
          ? styles.imageMessage
          : styles.image,
        style,
      ]}
      contentFit={resizeMode}
      source={source}
      priority={type === "avatar" ? "high" : "normal"}
    />
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 360,
  },
  image: {
    aspectRatio: 4 / 3,
  },
  imageMessage: {
    aspectRatio: 1,
  },
});

export default ImageCustom;
