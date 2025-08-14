import { useEffect, useState } from "react";
import todoType from "../types/todoType";
import axios from "axios";
import { API_BASE_URL } from "../config";

const HomePageNew = () => {
  const [todos, setTodos] = useState<todoType[] | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/auth`, {
          withCredentials: true,
        });
        setTodos(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    checkAuth();
  }, []);

  return (
    <>
      {todos === null ? (
        <p>No todos</p>
      ) : (
        <>
          {todos.map((todo) => (
            <p>{todo.task}</p>
          ))}
        </>
      )}
    </>
  );
};

export default HomePageNew;
