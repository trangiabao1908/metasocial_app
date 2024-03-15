import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { changePasswordAPI, logoutApi } from "../../api/authApi";
import { useDispatch } from "react-redux";
import { setLogout } from "../../redux/user";
import { clearPost } from "../../redux/post";
const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const dispatch = useDispatch();
  const handleLogout = async () => {
    const req = await logoutApi();
    if (req.success) {
      dispatch(setLogout());
      dispatch(clearPost());
    }
  };

  const handleChangePassword = async () => {
    values = {
      currentPassword,
      newPassword,
      confirmNewPassword,
    };
    const res = await changePasswordAPI(values);
    if (res && res.success) {
      Alert.alert(
        "Thông Báo",
        `${res.message}, Bạn có muốn đăng xuất không?`,
        [
          {
            text: "Hủy",
            style: "cancel",
          },
          { text: "Đăng Xuất", onPress: handleLogout },
        ],
        { cancelable: false }
      );
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "white" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback
        accessible={false}
        onPress={() => Keyboard.dismiss()}
      >
        <View style={styles.container}>
          <Text style={styles.label}>Mật khẩu hiện tại:</Text>
          <TextInput
            style={styles.textInput}
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <Text style={styles.label}>Mật khẩu mới:</Text>
          <TextInput
            style={styles.textInput}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <Text style={styles.label}>Xác nhận mật khẩu mới:</Text>
          <TextInput
            style={styles.textInput}
            secureTextEntry
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
          />
          <TouchableOpacity
            style={styles.btnLogin}
            onPress={handleChangePassword}
          >
            <Text style={styles.loginText}>Đổi mật khẩu</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  textInput: {
    marginBottom: 10,
    width: "80%",
    borderRadius: 7,
    height: 40,
    borderColor: "#C2C2C2",
    paddingHorizontal: 11,
    height: 40,
    borderWidth: 1,
  },
  btnLogin: {
    marginVertical: 30,
    padding: 14,
    backgroundColor: "#00D5FA",
    borderRadius: 7,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
  },
  loginText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
});
export default ChangePassword;
