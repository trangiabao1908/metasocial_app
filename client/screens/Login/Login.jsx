import { useHeaderHeight } from "@react-navigation/elements";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { styles } from "./Login";
// import { setMode } from "../../redux/index.js";
// import Form Login
import FormLogin from "./FormLogin";
const Login = ({}) => {
  const height = useHeaderHeight();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.safeArea}
      keyboardVerticalOffset={height + 40}
    >
      <TouchableWithoutFeedback
        accessible={false}
        onPress={() => Keyboard.dismiss()}
      >
        <View style={styles.loginContainer}>
          <View style={styles.loginHeader}>
            <Text style={styles.LoginHeaderBrand}>METASO</Text>
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
      {/* 
      <Button onPress={handleChangeMode} title="Change Theme"></Button> */}
    </KeyboardAvoidingView>
  );
};

export default Login;
