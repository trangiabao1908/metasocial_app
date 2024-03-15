import { useEffect } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { useRoute } from "@react-navigation/native";

const InputPost = ({
  inputRef,
  handlePressIn,
  handleChange,
  handleBlur,
  values,
  setFieldValue,
}) => {
  const route = useRoute();
  const type = route?.params.type;

  useEffect(() => {
    if (type === "update") {
      const dataUpdate = route?.params.dataUpdate[0];
      setFieldValue("title", dataUpdate.title);
    }
  }, [route]);

  return (
    <View style={styles.input}>
      <TextInput
        ref={inputRef}
        placeholder="Bạn đang nghĩ gì?"
        style={styles.input}
        autoFocus={false}
        multiline
        focusable={false}
        onPressIn={handlePressIn}
        onChangeText={handleChange("title")}
        onBlur={handleBlur("title")}
        value={values.title}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    borderColor: "gray",
    marginBottom: 20,
    paddingHorizontal: 10,
    width: "100%",
    fontSize: 16,
  },
});

export default InputPost;
