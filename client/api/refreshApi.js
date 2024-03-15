export const refreshTokenApi = async (refreshToken) => {
  try {
    const res = await API.post("/auth/refresh_token", { refreshToken });
    if (res.data.success === true) {
      return res.data;
    }
  } catch (err) {
    console.log(err.response?.data.message);
  }
};
