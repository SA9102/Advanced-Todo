import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthProvider";
import { useNavigate } from "react-router";
import { LOGIN } from "../routes/routes";

const useCheckAuthNew = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      navigate(LOGIN);
    }
  }, []);
};

export default useCheckAuthNew;
