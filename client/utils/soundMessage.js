import { Audio } from "expo-av";
export const setAudioMode = async () => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: false,
    });
    console.log("Chế độ âm thanh đã được cài đặt.");
  } catch (error) {
    console.log("Lỗi khi cài đặt chế độ âm thanh:", error);
  }
};

export const playSoundFromLocalFile = async () => {
  const playbackObject = new Audio.Sound();
  try {
    await playbackObject.loadAsync(require("../assets/notification.mp3"));
    await playbackObject.playAsync();
    console.log("Âm thanh thông báo được phát.");
  } catch (error) {
    console.log("Lỗi khi tải và phát âm thanh:", error);
  }
};
