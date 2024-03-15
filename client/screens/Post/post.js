import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as yup from "yup";
import { Formik } from "formik";
import PostScreen from "../../components/post/top";
import HeaderPost from "../../components/post/header";
import { createPostApi, updatePostApi } from "../../api/postApi";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/config";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPostRD, updatePostRD } from "../../redux/post";
import { useRoute } from "@react-navigation/native";
import { EventRegister } from "react-native-event-listeners";
import { saveImageToCache } from "../../utils/caching";

const Post = ({ navigation }) => {
  // const
  const route = useRoute();
  const type = route?.params.type;

  const [loading, setLoading] = useState(false);

  const [isNew, setIsNew] = useState(false);

  const [isDisable, setDisable] = useState(false);

  const userID = useSelector((state) => state?.userState?.user?._id);

  const dispatch = useDispatch();

  const validationSchema = yup.object().shape({
    title: yup.string().max(100, ({ max }) => `Giới hạn là ${max} chữ`),
    image: yup.array(),
  });

  const handleCreatePost = async (values) => {
    try {
      setDisable(true);
      uploadImage(values);
    } catch (err) {
      console.log(err);
    }
  };

  async function uploadImage(values) {
    try {
      let arrayData = [];
      setLoading(true);
      const uploadedUrls = await Promise.all(
        values.image.map(async (item) => {
          const response = await fetch(item.uri);
          const blob = await response.blob();
          const nameFolder =
            item.type === "image"
              ? `${userID}/post/assets/image/`
              : `${userID}/post/assets/video/`;
          const nameFile = new Date().getTime() + `_${userID}`;

          const storageRef = ref(storage, nameFolder + nameFile);
          const upload = await uploadBytesResumable(storageRef, blob);
          const downloadURLs = await getDownloadURL(upload.ref);

          // saveImageToCache(downloadURLs, blob);
          return {
            url: downloadURLs,
            type: item.type,
          };
        })
      );
      await Promise.all(uploadedUrls);

      arrayData.push(...uploadedUrls);

      if (type === "update") {
        let assets = [];
        if (isNew) {
          assets = arrayData;
        } else {
          assets = route.params.dataUpdate[0].assets;
        }

        const update = await updatePostApi(
          values,
          assets,
          route.params.dataUpdate[0]._id
        );
        if (update.status) {
          const payload = {
            _id: update.postUpdate._id,
            title: update.postUpdate.title,
            assets: update.postUpdate.assets,
          };

          dispatch(updatePostRD(payload));
          setLoading(false);
          EventRegister.emit("updatePostSuccess");
        }
        setDisable(false);
        console.log("update");

        navigation.navigate("Home");
      } else {
        if (values.image.length > 0) {
          const create = await createPostApi(values, arrayData);
          console.log("post");

          if (create.status) {
            const payload = {
              _id: create.post._id,
              author: create.post.author,
              title: create.post.title,
              assets: create.post.assets,
              like: [],
              comment: [],
            };
            dispatch(createPostRD(payload));
            setLoading(false);
            setDisable(false);
            navigation.navigate("Home");
          }
        } else {
          setLoading(false);
          setDisable(false);
          Alert.alert("Bạn không thể đăng bài khi không có hình ảnh.");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Formik
      initialValues={{
        title: "",
        image: [],
      }}
      validationSchema={validationSchema}
      onSubmit={handleCreatePost}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        setFieldValue,
        errors,
      }) => (
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="white" />
          <HeaderPost
            navigation={navigation}
            handleSubmit={handleSubmit}
            type={type}
            isDisable={isDisable}
          />
          {errors.title && <Text>{errors.title}</Text>}
          {loading && (
            <View
              style={{
                position: "absolute",
                top: "20%",
                left: "50%",
                zIndex: 1,
              }}
            >
              <ActivityIndicator size={35} color={"black"} />
            </View>
          )}

          <PostScreen
            navigation={navigation}
            handleChange={handleChange}
            handleBlur={handleBlur}
            values={values}
            setFieldValue={setFieldValue}
            isNew={isNew}
            setIsNew={setIsNew}
          />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    borderTopColor: "rgb(219, 219, 219)",
    borderTopWidth: 1,
  },
});

export default Post;
