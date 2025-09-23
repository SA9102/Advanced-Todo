import { Link, useNavigate, useParams } from "react-router";
import { useGetTodo, useTodoActions } from "../store/todoStore";
import { useContext, useState } from "react";
import { HOME } from "../routes/routes";
import tagType from "../types/tagType";
import { useGetTags } from "../store/tagStore";
import TagInput from "../components/TagInput";
import axios from "axios";
import { API_BASE_URL } from "../config";
import AuthContext from "../context/AuthProvider";
import todoType from "../types/todoType";
import {
  Button,
  ButtonGroup,
  Stack,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const EditTodoPage = () => {
  const todoId = useParams().id; // Get the todo id from the url
  const todo = useGetTodo(todoId!);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [todoInput, setTodoInput] = useState(useGetTodo(todoId!));
  const { updateTodo } = useTodoActions();
  const tags = useGetTags();

  const handleSaveToDB = async () => {
    try {
      // await axios.put(`${API_BASE_URL}/`)
      await axios.patch(
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

  const handleSaveToLS = () => {
    let todosLS = JSON.parse(localStorage.getItem("todos"));

    if (!todosLS) {
      todosLS = [todoInput];
    } else {
      todosLS = todosLS.map((todo: todoType) => {
        if (todo.taskId === todoInput?.taskId) {
          return todoInput;
        } else {
          return todo;
        }
      });
    }

    localStorage.setItem("todos", JSON.stringify(todosLS));
    navigate(HOME);
  };
  console.log("START");
  console.log(typeof todoInput?.start);
  console.log(todoInput);
  // console.log(todoInput.start);
  return (
    <>
      {todoInput ? (
        <Stack gap="1rem">
          <TextField
            label="Task"
            value={todoInput.task}
            onChange={(e) =>
              setTodoInput({ ...todoInput, task: e.target.value })
            }
          />
          <TextField label="Description" multiline maxRows={4} rows={4} />

          <Stack gap="xs">
            <Typography
            // size="sm"
            >
              Priority
            </Typography>
            <ButtonGroup>
              <Button
                size="small"
                variant={todoInput.priority === "1" ? "contained" : "outlined"}
                onClick={() => setTodoInput({ ...todoInput, priority: "1" })}
              >
                Low
              </Button>
              <Button
                size="small"
                variant={todoInput.priority === "2" ? "contained" : "outlined"}
                onClick={() => setTodoInput({ ...todoInput, priority: "2" })}
              >
                Medium
              </Button>
              <Button
                size="small"
                variant={todoInput.priority === "3" ? "contained" : "outlined"}
                onClick={() => setTodoInput({ ...todoInput, priority: "3" })}
              >
                High
              </Button>
            </ButtonGroup>
          </Stack>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Start"
              onChange={(newValue) => {
                const datetime = new Date(newValue);
                setTodoInput({ ...todoInput, start: datetime });
              }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="End"
              onChange={(newValue) => {
                const datetime = new Date(newValue);
                setTodoInput({ ...todoInput, start: datetime });
              }}
            />
          </LocalizationProvider>
          <TagInput todoInput={todoInput} setTodoInput={setTodoInput} />
          <Stack direction="row" justifyContent="space-evenly">
            <Button
              // flex="1"
              //  variant="outline"
              component={Link}
              to={HOME}
            >
              Cancel
            </Button>
            <Button
              // flex="1"
              onClick={() => {
                updateTodo(todoInput);
                if (auth) {
                  handleSaveToDB();
                } else {
                  handleSaveToLS();
                }
              }}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      ) : (
        <p>Not found</p>
      )}
    </>
  );
};

export default EditTodoPage;
