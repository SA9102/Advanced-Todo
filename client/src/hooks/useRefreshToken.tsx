// Checks if the access token is valid. If not, it provides a
// new access token if the refresh token is valid.

import axios from "axios";
import { API_BASE_URL } from "../config";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const useRefreshToken = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const refresh = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/refreshToken`, {
        withCredentials: true,
      });
      setAuth({
        _id: res.data._id,
        username: res.data.username,
        accessToken: res.data.accessToken,
      });
      return res.data.accessToken;
    } catch (err) {
      console.log(err);
    }
  };

  return refresh;
};

export default useRefreshToken;
