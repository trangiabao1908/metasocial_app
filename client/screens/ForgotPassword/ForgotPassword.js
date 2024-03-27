import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { forgotPasswordAPI, resetPasswordAPI } from "../../api/authApi";

const ForgotPassword = ({ navigation }) => {
  const [showChangePassword, setShowChangePassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [token, setToken] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");
  const [showLoading, setShowLoading] = React.useState(false);
  const handleSentResetPassword = async () => {
    setShowLoading(true);
    const res = await forgotPasswordAPI(email);
    if (res && res.success) {
      Alert.alert("Thông Báo", res.message);
      setShowChangePassword(true);
    }
    setShowLoading(false);
  };
  const handleChangePassword = async () => {
    const values = {
      email,
      token,
      newPassword,
      confirmNewPassword,
    };
    const res = await resetPasswordAPI(values);
    if (res && res.success) {
      Alert.alert("Thông Báo", res.message);
      setShowChangePassword(false);
      setEmail("");
      navigation.navigate("Login");
    } else if (res && res === "again") {
      setShowChangePassword(false);
      setNewPassword("");
      setConfirmNewPassword("");
      setToken("");
    }
    setNewPassword("");
    setConfirmNewPassword("");
    setToken("");
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.safeArea}
    >
      <TouchableWithoutFeedback
        accessible={false}
        onPress={() => Keyboard.dismiss()}
      >
        <View style={styles.loginContainer}>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={styles.loginForm}>
              {!showChangePassword ? (
                <>
                  <Text style={styles.label}>
                    Vui lòng điền email tài khoản của bạn:
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    value={email}
                    onChangeText={setEmail}
                  />
                  <TouchableOpacity
                    style={styles.btnLogin}
                    onPress={handleSentResetPassword}
                  >
                    <Text style={styles.loginText}>Gửi mã xác nhận</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.label}>Mã xác thực:</Text>
                  <TextInput
                    style={styles.textInput}
                    value={token}
                    onChangeText={setToken}
                  />
                  <Text style={styles.label}>Mật khẩu mới:</Text>
                  <TextInput
                    secureTextEntry
                    style={styles.textInput}
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                  <Text style={styles.label}>Xác thực mật khẩu mới:</Text>
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
                </>
              )}

              {showLoading && (
                <>
                  <View
                    style={{
                      marginTop: 20,
                      flex: 1,
                      alignItems: "center",
                    }}
                  >
                    <ActivityIndicator color="#888888" />
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0F2F5",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  loginContainer: {
    flex: 1,
  },
  btnLogin: {
    marginVertical: 10,
    padding: 14,
    backgroundColor: "#00D5FA",
    borderRadius: 7,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  textInput: {
    marginBottom: 10,
    borderRadius: 7,
    height: 40,
    borderColor: "#C2C2C2",
    paddingHorizontal: 11,
    borderWidth: 1,
  },
  loginForm: {
    width: "90%",
    padding: 32,
    marginVertical: 40,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
  },
});

export default ForgotPassword;
