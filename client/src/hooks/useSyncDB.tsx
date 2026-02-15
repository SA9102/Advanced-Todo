// Updates the database with the current todos.

import { useContext, useEffect } from "react";
import axios from "axios";
import { useGetTodos } from "../store/todoStore";
import { useSetSynced } from "../store/syncStore";
import AuthContext from "../context/AuthProvider";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const useSyncDB = () => {
  const todos = useGetTodos();
  const { auth } = useContext(AuthContext);
  //   const { setSynced } = useSetSynced();
  //   //   console.log("EXECUTED");

  useEffect(() => {
    const updateDB = async () => {
      try {
        const res = await axios.put(
          `${API_BASE_URL}/todo`,
          { username: auth.username, data: todos },
          { withCredentials: true }
        );
      } catch (err) {
        console.log(err);
      }
    };

    updateDB();
  }, []);
};

export default useSyncDB;
