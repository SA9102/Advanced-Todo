import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router";
import { HOME } from "../routes/routes";

const useLogout = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = async () => {
    // setAuth({});
    console.log(auth);
    console.log("doing logout");
    try {
      const res = await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: auth.accessToken },
        }
      );
      console.log(res);
      setAuth({});
    } catch (err) {
      console.log(err);
    }
  };

  return logout;
};

export default useLogout;
