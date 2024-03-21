import React, { memo } from "react";
import { Text, View } from "react-native";
const HeaderComponent = ({ noticesToday }) => {
  return (
    <View
      style={{
        flex: 1,
        borderTopWidth: noticesToday.length > 0 && 0.2,
        borderTopColor: noticesToday.length > 0 && "gray",
        paddingVertical: 20,
      }}
    >
      <View style={{ marginLeft: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          Những ngày trước
        </Text>
      </View>
    </View>
  );
};

export default memo(HeaderComponent);
