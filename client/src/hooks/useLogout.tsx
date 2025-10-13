import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import axios from "axios";
import { API_BASE_URL } from "../config";

const useLogout = () => {
  const { setAuth } = useContext(AuthContext);

  const logout = async () => {
    // setAuth({});
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/logout`, {
        withCredentials: true,
      });
      console.log("SUCCESS");
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return logout;
};

export default useLogout;
