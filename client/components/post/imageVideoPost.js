import { FlatList, Dimensions } from "react-native";
import { Fragment, useEffect } from "react";
import ImageCustom from "../custom/imageCustom";
import { Video } from "expo-av";
import { useRoute } from "@react-navigation/native";

const widthScreen = Dimensions.get("screen").width;

const ImageVideoPost = ({ selectedImages, isListImage, isNew }) => {
  const route = useRoute();
  const type = route.params.type;
  const renderImageVideo = ({ item }) => {
    return (
      <ImageCustom
        source={{ uri: type === "update" && !isNew ? item.url : item.uri }}
        style={{
          width: isListImage ? widthScreen / 2 : widthScreen,
          height: isListImage ? widthScreen / 2 : widthScreen,
        }}
      />
    );
  };

  return (
    <Fragment>
      {selectedImages.length === 1 && selectedImages[0].type === "video" ? (
        <Video
          // ref={videoRef}
          source={{ uri: selectedImages[0].uri }}
          style={{ width: widthScreen, height: widthScreen }}
          useNativeControls
          resizeMode="contain"
          shouldPlay
          // onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        />
      ) : (
        <FlatList
          scrollEnabled={false}
          numColumns={2}
          data={selectedImages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderImageVideo}
        />
      )}
    </Fragment>
  );
};

export default ImageVideoPost;
