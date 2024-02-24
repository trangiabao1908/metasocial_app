import { useHeaderHeight } from "@react-navigation/elements";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setMode } from "../../redux/index.js";
// import Form Login
import FormLogin from "./FormLogin";
const Login = ({ navigation }) => {
  const height = useHeaderHeight();
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.mode);
  const handleChangeMode = () => {
    dispatch(setMode());
  };
  console.log(mode);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.safeArea}
      keyboardVerticalOffset={height - 30}
    >
      <TouchableWithoutFeedback
        accessible={false}
        onPress={() => Keyboard.dismiss()}
      >
        <View style={styles.loginContainer}>
          <View style={styles.loginHeader}>
            <Text style={styles.LoginHeaderBrand}>MetaSo</Text>
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={styles.loginForm}>
              <Text style={styles.loginWelcome}>Welcome to MetaSocial</Text>
              <FormLogin></FormLogin>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* <Button onPress={handleChangeMode} title="Change Theme"></Button> */}
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0F2F5",
  },
  loginContainer: {
    flex: 1,
  },
  loginHeader: {
    // backgroundColor: "#00D5FA",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // paddingTop: 10,
    // paddingBottom: 10,
    paddingLeft: "5%",
    paddingRight: "5%",
  },
  LoginHeaderBrand: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 35,
  },
  loginForm: {
    width: "90%",
    padding: 32,
    marginBottom: 40,
    marginTop: 35,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
  },
  loginWelcome: {
    fontSize: 18,
    marginBottom: 25,
    fontWeight: "500",
  },
});
export default Login;
