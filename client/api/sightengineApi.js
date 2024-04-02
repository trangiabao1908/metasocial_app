import axios from "axios";
export const checkImage = async (imageUrl) => {
  try {
    const res = await axios.get("https://api.sightengine.com/1.0/check.json", {
      params: {
        url: imageUrl,
        models: "nudity-2.0,wad,offensive",
        api_user: `${process.env.EXPO_PUBLIC_API_USER}`,
        api_secret: `${process.env.EXPO_PUBLIC_API_SECRET}`,
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
