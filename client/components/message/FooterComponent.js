import { View, StyleSheet, ActivityIndicator } from "react-native";
import React from "react";
import ImageCustom from "../custom/imageCustom";
const FooterComponent = ({ loadingMesasge, preMessageImage }) => {
  return (
    loadingMesasge && (
      <View
        style={{
          justifyContent: "flex-end",
          flexDirection: "row",
          marginHorizontal: 10,
          marginVertical: 15,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 10,
            borderRadius: 24,
            maxWidth: "60%",
            marginBottom: 5,
            position: "relative",
          }}
        >
          <ImageCustom
            source={{ uri: `${preMessageImage}` }}
            style={{
              width: 190,
              height: 190,
              borderRadius: 8,
            }}
            resizeMode="contain"
            type={"image"}
          />
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#888888" />
          </View>
        </View>
      </View>
    )
  );
};
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default React.memo(FooterComponent);
