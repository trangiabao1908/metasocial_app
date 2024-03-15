import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store.js";

import { useEffect } from "react";
import { ToastProvider } from "react-native-toast-notifications";
import CustomToast from "./components/custom/CustomToast.js";
import { Layout } from "./screens/Layout.js";
import { checkToken } from "./utils/processToken.js";

export default function App() {
  useEffect(() => {
    const validToken = async () => {
      console.log("Check");
      await checkToken();
    };
    validToken();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastProvider
          placement="top"
          offset={15}
          renderType={{
            custom_toast: (toast) => <CustomToast toast={toast} />,
          }}
        >
          <Layout />
        </ToastProvider>
      </PersistGate>
    </Provider>
  );
}
