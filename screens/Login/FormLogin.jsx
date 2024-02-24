import { Formik } from "formik";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as React from "react";
import * as yup from "yup";
import { registerApi, loginApi } from "../../api/authApi";
import { useDispatch } from "react-redux";
import { setLogin } from "../../redux/index.js";
import { AxiosError } from "axios";
// define login schema
const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const initialValueLogin = {
  email: "",
  password: "",
};

// define register schema
const registerSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
  confirmpassword: yup.string().required("Please confirm your password"),
});
const initialValueRegister = {
  email: "",
  password: "",
  confirmpassword: "",
  username: "",
};

const FormLogin = () => {
  const [pageType, setPageType] = React.useState("login");
  const isLoginPage = pageType == "login";
  const isRegisterPage = pageType == "register";
  const dispath = useDispatch();
  const handleFormSubmit = async (values, onSubmitProps) => {
    try {
      const res = isLoginPage
        ? await loginApi(values)
        : await registerApi(values);
      if (res.success === true) {
        isLoginPage ? dispath(setLogin(res)) : "";
        console.log("login successful");
        alert(res.message);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data.message);
        alert(err.response?.data.message);
      } else if (err instanceof Error) {
        return {
          success: false,
          message: err.message,
        };
      }
    }
    onSubmitProps.resetForm();
  };
  return (
    <>
      <Formik
        initialValues={isLoginPage ? initialValueLogin : initialValueRegister}
        onSubmit={handleFormSubmit}
        validationSchema={isLoginPage ? loginSchema : registerSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          resetForm,
        }) => (
          <>
            {isRegisterPage && (
              <>
                <TextInput
                  style={[styles.defaultSizeText, styles.textInput]}
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  placeholder="Username"
                  value={values.username}
                />
                {touched.username && errors.username && (
                  <Text style={styles.errorText}>{errors.username}</Text>
                )}
              </>
            )}
            <View>
              <TextInput
                style={[
                  styles.defaultSizeText,
                  styles.textInput,
                  isRegisterPage && { marginTop: 15 },
                ]}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                placeholder="Email"
                value={values.email}
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
              <TextInput
                style={[
                  styles.defaultSizeText,
                  { marginTop: 15 },
                  styles.textInput,
                ]}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                placeholder="Password"
                value={values.password}
                secureTextEntry
              ></TextInput>
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
              {isRegisterPage && (
                <>
                  <TextInput
                    style={[
                      styles.defaultSizeText,
                      { marginTop: 15 },
                      styles.textInput,
                    ]}
                    onChangeText={handleChange("confirmpassword")}
                    onBlur={handleBlur("confirmpassword")}
                    placeholder="Confirm Password"
                    value={values.confirmpassword}
                    secureTextEntry
                  ></TextInput>
                  {touched.confirmpassword && errors.confirmpassword && (
                    <Text style={styles.errorText}>
                      {errors.confirmpassword}
                    </Text>
                  )}
                </>
              )}
            </View>
            <View>
              <TouchableOpacity style={styles.btnLogin} onPress={handleSubmit}>
                <Text style={styles.loginText}>
                  {isLoginPage ? "LOGIN" : "REGISTER"}
                </Text>
              </TouchableOpacity>
              <View>
                <Pressable
                  onPress={() => {
                    resetForm();
                    setPageType(isLoginPage ? "register" : "login");
                  }}
                >
                  {({ pressed }) => (
                    <Text
                      style={
                        pressed
                          ? styles.textNavigateRegisterHover
                          : styles.textNavigateRegister
                      }
                    >
                      {isLoginPage
                        ? "You dont' have an account? Click here to register"
                        : "You have an account? Click here to login"}
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          </>
        )}
      </Formik>
    </>
  );
};
const styles = StyleSheet.create({
  defaultSizeText: {
    fontSize: 15,
  },
  btnNavigate: {
    padding: 10,
    marginTop: 10,
  },
  textRegister: {
    fontSize: 14,
    fontWeight: "500",
  },
  textInput: {
    borderRadius: 7,
    borderColor: "#C2C2C2",
    paddingHorizontal: 11,
    height: 40,
    borderWidth: 1,
  },
  errorText: {
    marginLeft: 2,
    marginTop: 5,
    fontSize: 13,
    color: "red",
  },
  btnLogin: {
    marginVertical: 30,
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
  textNavigateRegister: {
    fontSize: 14,
    textDecorationLine: "underline",
  },
  textNavigateRegisterHover: {
    fontSize: 14,
    textDecorationLine: "none",
    color: "#E6FBFF",
  },
});

export default FormLogin;
