import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveImageToCache = async (imageUrl, imageData) => {
  try {
    await AsyncStorage.setItem(imageUrl, imageData);
  } catch (error) {
    console.error("Error saving image to cache:", error);
  }
};
export const getImageFromCache = async (imageUrl) => {
  try {
    const imageData = await AsyncStorage.getItem(imageUrl);
    return imageData;
  } catch (error) {
    console.error("Error getting image from cache:", error);
    return null;
  }
};
