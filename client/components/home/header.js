import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/Feather";

import { useNavigation } from "@react-navigation/native";

export const HeaderLeft = () => {
  return <Text style={[styles.brand]}>METASO</Text>;
};

export const HeaderRight = () => {
  const navigate = useNavigation();

  return (
    <View style={[styles.icon]}>
      <View>
        <View></View>
        <Icon.Button
          name="hearto"
          size={25}
          color="#000"
          backgroundColor="#ffffff"
          iconStyle={{
            marginRight: 0,
            paddingHorizontal: 3,
          }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => navigate.navigate("Notification")}
        ></Icon.Button>
        <View
          style={{
            position: "absolute",
            top: "18%",
            backgroundColor: "red",
            borderRadius: 360,
            // padding: 5,
            width: 10,
            height: 10,
            right: "18%",
          }}
        ></View>
      </View>

      <Icon2.Button
        name="message-circle"
        size={25}
        color="#000"
        backgroundColor="#ffffff"
        iconStyle={{
          marginRight: 0,

          paddingHorizontal: 3,
        }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => navigate.navigate("Chat")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  brand: {
    fontSize: 20,
    fontWeight: "bold",
  },
  icon: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
