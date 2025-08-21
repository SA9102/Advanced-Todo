// Ensures that the user remains logged in when they refresh
// the page or leave and come back to it.

import { useContext, useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import AuthContext from "../context/AuthProvider";

const usePersistLogin = () => {
  const refresh = useRefreshToken();
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.log(err);
      }
    };

    if (!auth?.accessToken) {
      verifyRefreshToken();
    }
  }, []);
};

export default usePersistLogin;
