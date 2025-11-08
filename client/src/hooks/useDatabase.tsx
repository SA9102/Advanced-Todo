import axios from "axios";
import { API_BASE_URL } from "../config";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import todoType from "../types/todoType";

const useDatabase = () => {
  const { auth } = useContext(AuthContext);

  const updateTodoDB = async (todo: todoType) => {
    try {
      await axios.put(
        `${API_BASE_URL}/todo/todo`,
        {
          _id: auth._id,
          username: auth.username,
          data: {
            taskId: todo.taskId,
            task: todo.task,
            description: todo.description,
            tags: todo.tags,
            isComplete: todo.isComplete,
            userId: auth._id,
            priority: "2",
            start: todo.start,
            end: todo.end,
          },
        },
        {
          withCredentials: true,
          headers: { Authorization: auth.accessToken },
        }
      );
      // navigate(HOME);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTodoDB = async (taskId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/todo`, {
        data: { id: taskId },
        withCredentials: true,
        headers: { Authorization: auth.accessToken },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return { updateTodoDB, deleteTodoDB };
};

export default useDatabase;
