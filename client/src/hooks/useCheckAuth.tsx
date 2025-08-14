// Checks if the user is logged in.
// If so, then fetch the user's todos from the database and store them in global state.

import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { useGetTodos, useTodoActions } from "../store/todoStore";
import { useGetSync } from "../store/syncStore";

const useCheckAuth = () => {
  const { setTodos } = useTodoActions();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const isSynced = useGetSync();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/auth`, {
          withCredentials: true,
        });
        if (res.data.data === null) {
          setTodos([]);
          setIsLoggedIn(false);
        } else {
          const t = res.data.data.map((todo) => {
            return {
              ...todo,
              tags: [],
              isChangingTask: false,
              isExpanded: false,
            };
          });
          setTodos(t);
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.log(err);
      }
    };

    checkAuth();
  }, []);
};

export default useCheckAuth;
