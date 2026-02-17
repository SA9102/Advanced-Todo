const isDev = import.meta.env.DEV;

export const API_BASE_URL = isDev
  ? "http://localhost:3000/api"
  : "https://advanced-todo-backend-j6a4.onrender.com/api";
