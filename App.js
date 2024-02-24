import { Provider, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PersistGate } from "redux-persist/integration/react";
import HomeScreen from "./screens/Home/Home.jsx";
import LoginScreen from "./screens/Login/Login.jsx";
import { store, persistor } from "./redux/store.js";
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Layout></Layout>
      </PersistGate>
    </Provider>
  );
}
export const Layout = () => {
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {isAuthenticated ? (
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              // headerLeft: (props) => <CustomHeaderLeft {...props} />,
              headerTitle: "Login",
              headerTitleAlign: "center",
              headerShadowVisible: false,
              gestureEnabled: false,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
