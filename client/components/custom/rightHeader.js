import { StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/Feather";
import { logoutApi } from "../../api/authApi";
import { Fragment } from "react";
import { useDispatch } from "react-redux";
import { setLogout } from "../../redux/user";
import { clearPost } from "../../redux/post";

const RightHeader = ({ screen, type }) => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const req = await logoutApi();
    if (req?.success) {
      dispatch(setLogout());
      dispatch(clearPost());
    }
  };

  return (
    <View style={styles.container}>
      {screen === "chat" && <Icon style={styles.icon} name="edit" size={25} />}

      {screen === "message" && (
        <Fragment>
          <Icon2 style={styles.icon} name="phone" size={25} />
          <Icon2 style={styles.icon} name="video" size={25} />
        </Fragment>
      )}
      {screen === "viewProfile" && (
        <Fragment>
          <Icon style={styles.icon} name="bells" size={25} />

          <Icon2 style={styles.icon} name="more-horizontal" size={25} />
        </Fragment>
      )}
      {screen === "personal" && (
        <Fragment>
          <Icon style={styles.icon} name="pluscircleo" size={25} />
          <TouchableOpacity onPress={handleLogout}>
            <Icon2 style={styles.icon} name="log-out" size={25} />
          </TouchableOpacity>
        </Fragment>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: "red",
  },
  icon: {
    fontWeight: "bold",
    marginLeft: 25,
  },
});

export default RightHeader;
