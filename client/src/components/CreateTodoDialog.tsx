import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useContext, useState } from "react";
import TagInput from "./TagInput";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Link, useNavigate } from "react-router";
import { HOME } from "../routes/routes";
import AuthContext from "../context/AuthProvider";
import { useTodoActions } from "../store/todoStore";
import { useGetTags } from "../store/tagStore";
import axios from "axios";
import todoType from "../types/todoType";
import emptyTodo from "../utils/emptyTodo";

import { v4 as uuidv4 } from "uuid";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const CreateTodoDialog = ({ open, setOpen }) => {
  // const [open, setOpen] = useState(false);
  // const todoId = useParams().id; // Get the todo id from the url
  // const todo = useGetTodo(todoId!);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  // const [todoInput, setTodoInput] = useState(useGetTodo(todoId!));
  const { createTodo } = useTodoActions();
  const tags = useGetTags();
  const [todoInput, setTodoInput] = useState(emptyTodo);

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
            // userId: todoInput?.userId,
            userId: auth._id,
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
      todosLS = [...todosLS, todoInput];
    }

    localStorage.setItem("todos", JSON.stringify(todosLS));
    navigate(HOME);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0,0,0,0.3)", // translucent overlay
            backdropFilter: "blur(5px)", // <-- blur effect
          },
        }}
      >
        <DialogTitle>Edit Todo</DialogTitle>
        <DialogContent>
          <Stack gap="1rem">
            <TextField
              label="Task"
              value={todoInput.task}
              onChange={(e) =>
                setTodoInput({ ...todoInput, task: e.target.value })
              }
            />
            <TextField
              label="Description"
              multiline
              maxRows={4}
              rows={4}
              value={todoInput.description}
              onChange={(e) =>
                setTodoInput({ ...todoInput, description: e.target.value })
              }
            />

            <Stack gap="xs">
              <Typography
              // size="sm"
              >
                Priority
              </Typography>
              <ButtonGroup>
                <Button
                  size="small"
                  variant={
                    todoInput.priority === "1" ? "contained" : "outlined"
                  }
                  onClick={() => setTodoInput({ ...todoInput, priority: "1" })}
                >
                  Low
                </Button>
                <Button
                  size="small"
                  variant={
                    todoInput.priority === "2" ? "contained" : "outlined"
                  }
                  onClick={() => setTodoInput({ ...todoInput, priority: "2" })}
                >
                  Medium
                </Button>
                <Button
                  size="small"
                  variant={
                    todoInput.priority === "3" ? "contained" : "outlined"
                  }
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
                  setTodoInput({ ...todoInput, end: datetime });
                }}
              />
            </LocalizationProvider>
            <TagInput todoInput={todoInput} setTodoInput={setTodoInput} />
            {/* <Stack direction="row" justifyContent="space-evenly">
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
              </Stack> */}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setTodoInput(todo);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              createTodo(todoInput);
              if (auth) {
                handleSaveToDB();
              } else {
                handleSaveToLS();
              }
              setTodoInput({ ...emptyTodo, taskId: uuidv4() });
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateTodoDialog;
