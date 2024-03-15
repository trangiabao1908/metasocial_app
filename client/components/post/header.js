import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import CustomButton from "../custom/button";
import { SafeAreaView } from "react-native-safe-area-context";

const Header = ({ navigation, handleSubmit, type, isDisable }) => {
  return (
    <SafeAreaView style={{ backgroundColor: "#F5F7F9" }} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Icon.Button
            onPress={() => navigation.goBack()}
            name="close"
            style={{
              backgroundColor: "#F5F7F9",
              textAlign: "left",
            }}
            color="black"
            iconStyle={{
              marginRight: 0,
            }}
            size={25}
          />

          <Text style={styles.text}>
            {type === "post" ? "Tạo bài viết" : " Chỉnh sửa bài viết"}
          </Text>

          <CustomButton
            title={type === "post" ? "Đăng" : "Cập nhật"}
            onPress={handleSubmit}
            styleText={{ fontSize: 16, fontWeight: 600 }}
            style={{
              paddingHorizontal: 10,
              backgroundColor: "rgb(228, 230, 235)",
            }}
            disable={isDisable}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    padding: 3,
    zIndex: 1,
  },

  content: {
    marginHorizontal: 15,
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Header;
