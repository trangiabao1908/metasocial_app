import { getToken } from "./processStore";
import { checkToken } from "./processToken";
export const config = async () => {
  await checkToken();
  const accessToken = await getToken();
  let headers = {};
  if (accessToken) {
    headers = {
      Authorization: `Bearer ${accessToken}`,
    };
  }
  return headers;
};
