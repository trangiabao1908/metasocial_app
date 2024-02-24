import { View, Text } from "react-native";
import { Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setLogout } from "../../redux";
const Home = ({ navigation }) => {
  const user = useSelector((state) => state.user);
  const dispath = useDispatch();
  const accessToken = useSelector((state) => state.accessToken);
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  console.log(isAuthenticated);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home</Text>
      <Text>UserID is loging: {user?._id}</Text>
      <Text>Username: {user?.username}</Text>
      <Text>Token is: {accessToken}</Text>
      <Button title="Login" onPress={() => navigation.navigate("Login")} />
      <Button title="logout" onPress={() => dispath(setLogout())}></Button>
    </View>
  );
};

export default Home;
