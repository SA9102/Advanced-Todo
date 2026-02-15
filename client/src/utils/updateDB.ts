// Updates the database with the current todos.

import axios from "axios";
import { getTodos, useGetTodos } from "../store/todoStore";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const updateDB = async () => {
  console.log("EXECUTED");
  // const todos = useGetTodos();
  const todos = getTodos();

  try {
    const res = await axios.put(
      `${API_BASE_URL}/todos`,
      { data: todos },
      { withCredentials: true }
    );
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

export default updateDB;
