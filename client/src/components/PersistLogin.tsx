import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthProvider";
import useRefreshToken from "../hooks/useRefreshToken";
import { Outlet } from "react-router";

const PersistLogin = () => {
  const refresh = useRefreshToken();
  const { auth, persist } = useContext(AuthContext);

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

  return <>{!persist ? <Outlet /> : <p>Loading...</p>}</>;
};

export default PersistLogin;
