import axios from "axios";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import todoType from "../types/todoType";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const useDatabase = () => {
  const { auth } = useContext(AuthContext);

  const getTodosDB = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/todo/`, {
        withCredentials: true,
        headers: { Authorization: auth.accessToken },
      });
      const todos = res.data.data;
      const formattedTodos = todos.map((todo: todoType) => ({
        taskId: todo.taskId,
        userId: todo.userId,
        task: todo.task,
        description: todo.description,
        priority: todo.priority,
        tags: todo.tags,
        start: todo.start === null ? null : new Date(todo.start),
        end: todo.end === null ? null : new Date(todo.end),
        isComplete: todo.isComplete,
        isChangingTask: false,
        isExpanded: false,
      }));

      return formattedTodos;
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  const quickAddTodoDB = async (todo: todoType) => {
    try {
      await axios.post(
        `${API_BASE_URL}/todo`,
        {
          _id: auth._id,
          username: auth.username,
          data: {
            taskId: todo.taskId,
            task: todo.task,
            description: "",
            tags: [],
            isComplete: false,
            userId: auth._id,
            priority: "1",
            start: null,
            end: null,
          },
        },
        {
          withCredentials: true,
          headers: { Authorization: auth.accessToken },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

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

  return { getTodosDB, quickAddTodoDB, updateTodoDB, deleteTodoDB };
};

export default useDatabase;
