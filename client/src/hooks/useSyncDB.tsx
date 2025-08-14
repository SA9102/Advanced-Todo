// Updates the database with the current todos.

import { useContext, useEffect } from "react";
import { API_BASE_URL } from "../config";
import axios from "axios";
import { useGetTodos } from "../store/todoStore";
import { useSetSynced } from "../store/syncStore";
import AuthContext from "../context/AuthProvider";

const useSyncDB = () => {
  console.log("HOOK IS EXECUTED");
  const todos = useGetTodos();
  const { auth } = useContext(AuthContext);
  //   const { setSynced } = useSetSynced();
  //   //   console.log("EXECUTED");

  useEffect(() => {
    const updateDB = async () => {
      console.log(todos);
      try {
        const res = await axios.put(
          `${API_BASE_URL}/todo`,
          { username: auth.username, data: todos },
          { withCredentials: true }
        );
        console.log("SYNC SUCCESSFUL");
        console.log(res);
      } catch (err) {
        console.log("SYNC FAILED");
        console.log(err);
      }
    };

    updateDB();
  }, []);
};

export default useSyncDB;
