import { Platform, StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0F2F5",
  },
  loginContainer: {
    // justifyContent: "center",
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
    marginTop: 5,
  },
  LoginHeaderBrand: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: Platform.OS === "ios" ? 90 : 60,
  },
  loginForm: {
    width: "90%",
    padding: 32,
    marginVertical: 40,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
  },
  loginWelcome: {
    fontSize: 18,
    marginBottom: 25,
    fontWeight: "500",
  },
});
