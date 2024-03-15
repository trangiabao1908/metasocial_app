import { Text, StyleSheet, TouchableOpacity } from "react-native";

const CustomButton = ({ onPress, title, style, styleText, disable }) => {
  return (
    <TouchableOpacity
      style={[styles.button, style, disable && styles.disableView]}
      onPress={onPress}
      disabled={disable}
    >
      <Text
        style={[styles.buttonText, styleText, disable && styles.disableText]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "rgb(239, 239, 239)",
    paddingHorizontal: 5,
    paddingVertical: 7,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 14,
  },
  disableView: {
    opacity: 0.8,
  },
  disableText: {
    opacity: 0.4,
  },
});

export default CustomButton;
