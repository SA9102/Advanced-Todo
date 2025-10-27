// import axios from "axios";
// import { API_BASE_URL } from "../config";
// import { useContext } from "react";
// import AuthContext from "../context/AuthProvider";

// const fetchTodosDB = async () => {

//     const {auth} = useContext(AuthContext)

//     try {
//         const res = await axios.get(`${API_BASE_URL}/todo/`, {
//           withCredentials: true,
//           headers: { Authorization: auth.accessToken },
//         });
//         const todos = res.data.data;
//         const formattedTodos = todos.map((todo) => ({
//           taskId: todo.taskId,
//           userId: todo.userId,
//           task: todo.task,
//           description: todo.description,
//           priority: todo.priority,
//           tags: todo.tags,
//           start: todo.start === null ? null : new Date(todo.start),
//           end: todo.end === null ? null : new Date(todo.end),
//           isComplete: todo.isComplete,
//           isChangingTask: false,
//           isExpanded: false,
//         }));
// }
