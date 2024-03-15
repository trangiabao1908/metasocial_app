import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import { useState, useRef, Fragment, useLayoutEffect, useEffect } from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import ImageCustom from "../custom/imageCustom";
import DropdownComp from "../custom/dropdown";
import FooterPost from "./footer";
import InputPost from "./inputPost";
import ImagePost from "./imageVideoPost";
import { useSelector } from "react-redux";

const PostScreen = ({
  handleChange,
  handleBlur,
  values,
  setFieldValue,
  isNew,
  setIsNew,
}) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [isFocus, setIsFocus] = useState(false);

  const height = useHeaderHeight();

  const user = useSelector((state) => state?.userState?.user);

  const inputRef = useRef();

  const handlePressIn = () => {
    inputRef.current.focus();
    setIsFocus(true);
  };

  const handlePressOut = () => {
    inputRef.current.blur();

    if (selectedImages.length === 0) {
      setIsFocus(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "white" }}
      keyboardVerticalOffset={height - 30}
    >
      <View style={styles.container}>
        <SafeAreaView
          style={{
            flex: 1,
          }}
        >
          <TouchableWithoutFeedback onPress={handlePressOut}>
            <ScrollView style={{ flex: 1 }}>
              <View
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 20,
                  marginVertical: 10,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <ImageCustom
                    style={{ width: 40, height: 40, marginRight: 10 }}
                    resizeMode="cover"
                    source={{ uri: user.picturePath }}
                    type="avatar"
                  />
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: 600 }}>
                      {user.username}
                    </Text>
                  </View>
                </View>
                <View>
                  <DropdownComp />
                </View>
              </View>
              <Fragment>
                <InputPost
                  inputRef={inputRef}
                  handlePressIn={handlePressIn}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  values={values}
                  setFieldValue={setFieldValue}
                />
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <ImagePost
                    isNew={isNew}
                    selectedImages={selectedImages}
                    isListImage={selectedImages.length > 1 ? true : false}
                    setFieldValue={setFieldValue}
                  />
                </View>
              </Fragment>
            </ScrollView>
          </TouchableWithoutFeedback>
        </SafeAreaView>

        <FooterPost
          isFocus={isFocus}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
          setIsFocus={setIsFocus}
          setFieldValue={setFieldValue}
          setIsNew={setIsNew}
          isNew={isNew}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  listImage: {
    display: "flex",
  },
});

export default PostScreen;
