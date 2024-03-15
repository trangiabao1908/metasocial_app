import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
const CustomToast = ({ toast }) => {
  return (
    <View
      style={{
        maxWidth: "90%",
        width: "90%",
        paddingHorizontal: 8,
        paddingVertical: 8,
        backgroundColor: "#rgba(240, 242, 245, 1)",
        borderLeftColor: "#00D5FA",
        borderLeftWidth: 7,
        marginVertical: 5,
        borderRadius: 22,
        justifyContent: "center",
      }}
    >
      <TouchableOpacity style={{ marginLeft: 10 }}>
        <Text style={{ color: "#333", fontSize: 15, fontWeight: "bold" }}>
          {toast?.message}
        </Text>
        {toast?.data?.username && (
          <Text
            style={{
              color: "#333",
              fontSize: 14,
              fontWeight: "500",
              marginTop: 2,
            }}
          >
            Từ: {toast?.data?.username}
          </Text>
        )}
        <Text
          style={{
            color: "#333",
            fontSize: 14,
            fontWeight: "500",
            marginTop: toast?.data?.user ? 2 : 6,
          }}
        >
          Nội dung: {toast?.data?.message}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomToast;
