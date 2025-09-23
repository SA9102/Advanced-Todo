import { useContext, useState } from "react";
import AuthContext from "../context/AuthProvider";
import { useNavigate } from "react-router";
import emptyTodo from "../utils/emptyTodo";
import todoType from "../types/todoType";
import { useGetTags } from "../store/tagStore";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { HOME } from "../routes/routes";
import TodoInputs from "../components/TodoInputs";
import { Button, Stack } from "@mui/material";

const NewTodoPage = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [todoInput, setTodoInput] = useState<todoType>(emptyTodo);
  const tags = useGetTags();

  const handleSaveToDB = async () => {
    try {
      // await axios.put(`${API_BASE_URL}/`)
      await axios.post(
        `${API_BASE_URL}/todo`,

        {
          _id: auth._id,
          username: auth.username,
          data: {
            taskId: todoInput?.taskId,
            task: todoInput?.task,
            description: todoInput?.description,
            tags: todoInput?.tags,
            isComplete: todoInput?.isComplete,
            userId: todoInput?.userId,
            priority: "2",
            start: todoInput?.start,
            end: todoInput?.end,
          },
        },
        {
          withCredentials: true,
          headers: { Authorization: auth.accessToken },
        }
      );
      navigate(HOME);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {todoInput ? (
        <>
          <TodoInputs />
          <Stack direction="row">
            <Button
              // flex="1"
              variant="outline"
              component={Link}
              to={HOME}
            >
              Cancel
            </Button>
            <Button
              // flex="1"
              onClick={() => {
                updateTodo(todoInput);
                handleSaveToDB();
              }}
            >
              Save
            </Button>
          </Stack>
        </>
      ) : (
        <p>Not found</p>
      )}
    </>
  );
};

export default NewTodoPage;
