import React, { memo } from "react";
import { Text, View } from "react-native";
const HeaderComponent2 = () => {
  return (
    <View
      style={{
        flex: 1,
        marginTop: 20,
      }}
    >
      <View style={{ marginLeft: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Mới nhất</Text>
      </View>
    </View>
  );
};

export default memo(HeaderComponent2);
