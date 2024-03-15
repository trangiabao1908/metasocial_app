import React, { memo } from "react";
import { View, Text } from "react-native";
import ImageCustom from "../custom/imageCustom";
import CustomButton from "../custom/button";
import { useNavigation } from "@react-navigation/native";
const HeaderComponent = ({ picturePath, username, selectedUserId }) => {
  const navigation = useNavigation();
  const handleGoToPerScreen = () => {
    navigation.navigate("Personal", {
      type: "viewProfile",
      authorID: selectedUserId,
    });
  };
  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
      }}
    >
      <ImageCustom
        source={{ uri: `${picturePath}` }}
        style={{ width: 100, height: 100 }}
        type="avatar"
      />
      <Text style={{ fontSize: 18, fontWeight: "500", marginVertical: 10 }}>
        {username}
      </Text>
      <CustomButton
        title="Xem trang cá nhân"
        onPress={handleGoToPerScreen}
        styleText={{ fontWeight: 600 }}
      />
    </View>
  );
};

export default memo(HeaderComponent);
