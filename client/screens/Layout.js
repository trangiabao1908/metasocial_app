import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
// Import Screen
import EditPerScreen from "../components/personal/edit.js";
import ChatScreen from "./Chat/chat.js";
import Detailpost from "./DetailPost/Detailpost.js";
import HomeScreen from "./Home/Home.js";
import LoginScreen from "./Login/Login.jsx";
import MessageScreen from "./Message/message.js";
import PersonalScreen from "./Personal/personal.js";
import PostScreen from "./Post/post";
import FriendScreen from "./Friend/Friends.js";
import SearchScreen from "./Search/search.js";
import Notification from "./Notification/Notification.js";

// Import Modal
import ModalComments from "../components/home/modalcmt.js";
import ModalEdit from "../components/home/modaledit.js";

// Import Custom Components
import LeftHeader from "../components/custom/leftHeader";
import RightHeader from "../components/custom/rightHeader";

import { useEffect, useRef, useState } from "react";
import { useToast } from "react-native-toast-notifications";
import { HeaderLeft, HeaderRight } from "../components/home/header.js";
import socket from "../utils/configSocket.js";
import { getToken } from "../utils/processStore.js";
import { playSoundFromLocalFile, setAudioMode } from "../utils/soundMessage.js";
import ChangePassword from "./ChangePassword/ChangePassword.js";
import ForgotPassword from "./ForgotPassword/ForgotPassword.js";

const Stack = createNativeStackNavigator();
export const Layout = () => {
  const isAuthenticated = useSelector(
    (state) => state.userState.isAuthenticated
  );
  const userLoggedId = useSelector((state) => state.userState?.user?._id);
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const toast = useToast();
  const toastRef = useRef(null);
  const handlePlayNotiMessage = async () => {
    await playSoundFromLocalFile();
  };
  useEffect(() => {
    if (userLoggedId != null) {
      console.log("setUserId");
      setUserId(userLoggedId);
    } else {
      console.log("setUserId null");
      setUserId(null);
    }
  }, [userLoggedId]);
  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);
  useEffect(() => {
    if (userId) {
      console.log("Has UserId");
      socket.connect();
      socket.emit("userIdLogged", userId);
      const runSetAudioMode = async () => {
        await setAudioMode();
      };
      runSetAudioMode();
      socket.on("receiveMessage", (newMessage) => {
        let newMessageFormatted;
        if (newMessage.receiverId._id.toString() === userId.toString()) {
          console.log(userLoggedId);
          if (newMessage.message && newMessage.message.length > 15) {
            newMessageFormatted = newMessage.message.substring(0, 15) + "...";
          } else {
            newMessageFormatted = newMessage.message;
          }
          handlePlayNotiMessage();
          if (toast) {
            toastRef.current.show("Bạn có một tin nhắn mới", {
              type: "custom_toast",
              duration: 2500,
              animationType: "slide-in",
              data: {
                username: `${newMessage.senderId.username}`,
                message:
                  `${newMessage.messageType}` === "text"
                    ? `${newMessageFormatted}`
                    : `Đã gửi một hình ảnh`,
                senderId: `${newMessage.senderId._id.toString()}`,
              },
            });
          }
        }
      });
      socket.on("notification", (notice) => {
        if (notice.action.receiver._id.toString() === userId.toString()) {
          let content = notice.action.content;
          handlePlayNotiMessage();
          if (toast) {
            toastRef.current.show("Bạn có một thông báo mới", {
              type: "custom_toast",
              duration: 2500,
              animationType: "slide-in",
              data: {
                message: content,
              },
            });
          }
        }
      });
    }
    return () => {
      console.log("Disconnected");
      socket.off("receiveMessage");
      socket.off("notification");
      socket.disconnect();
    };
  }, [userId]);
  useEffect(() => {
    const getTokenFromStore = async () => {
      const access_token = await getToken();
      if (access_token) {
        setAccessToken(access_token);
      } else {
        setAccessToken("");
      }
    };
    getTokenFromStore();
  }, [isAuthenticated]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShadowVisible: false,
        }}
      >
        {isAuthenticated && accessToken ? (
          <Stack.Group>
            <Stack.Group>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  // headerShown: false,
                  title: null,
                  headerLeft: () => <HeaderLeft />,
                  headerRight: () => <HeaderRight />,
                }}
              />

              <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={{
                  title: null,
                  navigationBarHidden: true,

                  headerLeft: () => <LeftHeader screen="chat" />,
                  headerRight: () => <RightHeader screen="chat" />,
                }}
              />

              <Stack.Screen
                name="Message"
                component={MessageScreen}
                options={{
                  title: null,
                  headerStyle: {
                    backgroundColor: "white",
                  },

                  headerLeft: () => <LeftHeader screen="message" />,
                  headerRight: () => <RightHeader screen="message" />,
                }}
              />

              <Stack.Screen
                name="Friend"
                component={FriendScreen}
                options={{
                  headerLeft: () => <LeftHeader screen="friend" />,
                  title: "Danh sách bạn bè",
                  headerTitleAlign: "center",
                  navigationBarHidden: true,
                }}
              />
              <Stack.Screen
                name="Search"
                component={SearchScreen}
                options={{
                  navigationBarHidden: true,
                  title: null,
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Notification"
                component={Notification}
                options={{
                  title: null,
                  headerLeft: () => <LeftHeader screen="Notification" />,
                }}
              />

              <Stack.Screen
                name="Personal"
                component={PersonalScreen}
                options={{
                  title: null,
                  headerStyle: {
                    backgroundColor: "white",
                  },
                  // navigationBarHidden: true,

                  animation: "fade",
                  headerLeft: () => <LeftHeader screen="personal" />,
                  headerRight: () => <RightHeader screen="personal" />,
                }}
              />
              <Stack.Screen
                name="EditPersonal"
                component={EditPerScreen}
                options={{
                  title: "Chỉnh sửa trang cá nhân",
                  animation: "slide_from_bottom",
                  animationDuration: 500,
                  headerTitleAlign: "center",
                  headerTitleStyle: {
                    fontSize: 18,
                  },
                  headerStyle: {
                    backgroundColor: "#F5F7F9",
                  },

                  // headerShown: false,
                  headerLeft: () => <LeftHeader screen="editPer" />,
                  // headerRight: () => <RightHeader screen="editPer" />,
                }}
              />
              <Stack.Screen
                name="ChangePassword"
                component={ChangePassword}
                options={{
                  title: "Thay đổi mật khẩu",
                  animation: "slide_from_bottom",
                  animationDuration: 500,
                  headerTitleAlign: "center",
                  headerTitleStyle: {
                    fontSize: 18,
                  },
                  headerStyle: {
                    backgroundColor: "#F5F7F9",
                  },
                  headerLeft: () => <LeftHeader screen="editPer" />,
                }}
              ></Stack.Screen>

              <Stack.Screen
                name="Post"
                component={PostScreen}
                options={{
                  title: "Tạo bài viết",
                  animation: "slide_from_bottom",
                  animationDuration: 500,
                  headerShown: false,
                  fullScreenGestureEnabled: true,
                }}
              />
              <Stack.Screen
                name="DetailPost"
                component={Detailpost}
                options={{
                  animation: "slide_from_bottom",
                  animationDuration: 500,
                }}
              />
            </Stack.Group>
            <Stack.Group screenOptions={{ presentation: "modal" }}>
              <Stack.Screen
                name="ModalComments"
                component={ModalComments}
                options={{
                  navigationBarHidden: true,
                }}
              />
              <Stack.Screen
                name="ModalEdit"
                component={ModalEdit}
                options={{
                  navigationBarHidden: true,
                  // fullScreenGestureEnabled: false,
                }}
              />
            </Stack.Group>
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                // headerLeft: (props) => <CustomHeaderLeft {...props} />,
                headerTitle: "Login",
                headerTitleAlign: "center",
                headerShadowVisible: false,
                gestureEnabled: false,
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ForgotPasswordScreen"
              component={ForgotPassword}
              options={{
                // headerLeft: (props) => <CustomHeaderLeft {...props} />,
                headerTitle: "Quên mật khẩu",
                headerTitleAlign: "center",
                headerShadowVisible: false,
                gestureEnabled: false,
                headerShown: true,
                headerLeft: () => <LeftHeader screen="friend" />,
              }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
