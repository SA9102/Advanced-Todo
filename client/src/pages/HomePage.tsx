import todoType from "../types/todoType";
import { useGetTodos, useTodoActions } from "../store/todoStore";
import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import emptyTodo from "../utils/emptyTodo";
import todoFiltersType from "../types/todoFiltersType";
import emptyTodoFilters from "../utils/emptyTodoFilters";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useSetSynced, useSynced } from "../store/syncStore";
import AuthContext from "../context/AuthProvider";
import DisplayOptions from "../components/DisplayOptions";
import {
  Alert,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TodoItem from "../components/TodoItem";
import CreateTodoDialog from "../components/CreateTodoDialog";
import { addTodoLS, deleteTodoLS, getTodosLS } from "../utils/localStorage";
import {
  getCompletedPendingTodos,
  getCompletedValue,
  getCurrentTodos,
  getNumberOfCompletedTodos,
  getPercentageOfCompletedPendingTodos,
  hasExceededEnd,
  hasExceededStart,
} from "../utils/todoUtils";

const HomePage = () => {
  const synced = useSynced();
  const setSynced = useSetSynced();
  const [newTodo, setNewTodo] = useState<todoType>(emptyTodo); // Input for adding a new todo
  const [todoFilters, setTodoFilters] =
    useState<todoFiltersType>(emptyTodoFilters); // Input for todo filters
  // The different 'states' that a todo item can be in
  const [filterGroups, setFilterGroups] = useState([
    "Pending",
    "Completed",
    "Upcoming",
    "Overdue",
  ]);
  // By what the todos are sorted
  const [sortBy, setSortBy] = useState<"name" | "priority">("priority");
  const [sortOrder, setSortOrder] = useState<"ascending" | "descending">(
    "ascending"
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [loginNotification, setLoginNotification] = useState(false);
  const [LSNotification, setLSNotification] = useState(false);
  const { auth } = useContext(AuthContext);
  const todos: todoType[] = useGetTodos(); // Get all todos from store
  const { createTodo, setTodos } = useTodoActions();

  // Checks if the user is logged in, and if so then get their todos.
  // useCheckAuth();
  const handleSyncDB = async () => {
    const formattedTodos = todos.map((todo) => ({
      taskId: todo.taskId,
      userId: todo.userId,
      task: todo.task,
      description: todo.description,
      isComplete: todo.isComplete,
      priority: todo.priority,
      start: todo.start,
      end: todo.end,
    }));
    try {
      const res = await axios.put(
        `${API_BASE_URL}/todo/`,
        { _id: auth._id, username: auth.username, data: formattedTodos },
        { withCredentials: true, headers: { Authorization: auth.accessToken } }
      );
      setSynced(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSaveToDB = async () => {
    try {
      // await axios.put(`${API_BASE_URL}/`)
      await axios.post(
        `${API_BASE_URL}/todo`,
        {
          _id: auth._id,
          username: auth.username,
          data: {
            taskId: newTodo.taskId,
            task: newTodo.task,
            description: "",
            tags: [],
            isComplete: false,
            // userId: todoInput?.userId,
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
      navigate(HOME);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteTodoLS = (todoId: string) => {
    deleteTodoLS(todos, todoId);
  };

  const handleFetchTodos = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/todo/`, {
        withCredentials: true,
        headers: { Authorization: auth.accessToken },
      });
      const todos = res.data.data;
      const formattedTodos = todos.map((todo) => ({
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

      setTodos(formattedTodos);
    } catch (err) {
      console.log(err);
    }
  };

  const handleTransferLSTodosToDB = async () => {
    let todosLS = JSON.parse(localStorage.getItem("todos"));
    // When we fetch the data from local storage, the date values will
    // no longer be date objects but strings instead, so we must convert
    // these back into date objects.
    if (todosLS) {
      todosLS = todosLS.map((todo) => {
        let start = null;
        let end = null;
        if (todo.start) {
          start = new Date(todo.start);
        }

        if (todo.end) {
          end = new Date(todo.end);
        }

        return { ...todo, start, end, userId: auth._id };
      });
      const newTodos = [...todos, ...todosLS];
      try {
        const res = await axios.put(
          `${API_BASE_URL}/todo/`,
          { _id: auth._id, username: auth.username, data: newTodos },
          {
            withCredentials: true,
            headers: { Authorization: auth.accessToken },
          }
        );
        setTodos(newTodos);
        localStorage.setItem("todos", JSON.stringify([]));
      } catch (err) {
        console.log(err);
      }
    }
  };

  // Set the current todo input to empty
  const resetTodo = () => {
    setNewTodo({ ...emptyTodo, taskId: uuidv4() });
  };

  const getFilteredTodos = () => {
    let filtered = [...todos];

    // If the text input is not empty, then filter by text within task and/or description
    if (todoFilters.text.trim() !== "") {
      filtered = filtered.filter(
        (todo) =>
          todo.task.toLowerCase().includes(todoFilters.text.toLowerCase()) ||
          todo.description
            .toLowerCase()
            .includes(todoFilters.text.toLowerCase())
      );
    }

    // Filter by priority.
    filtered = filtered.filter((todo) =>
      todoFilters.priority.includes(todo.priority)
    );

    // Fitler by tags. If no tags are selected, then show todos belonging to all tags.
    if (todoFilters.tags.length > 0) {
      filtered = filtered.filter((todo) => {
        for (let i = 0; i < todo.tags.length; i++) {
          for (let j = 0; j < todoFilters.tags.length; j++) {
            if (todo.tags[i] === todoFilters.tags[j]) {
              return todo;
            }
          }
        }
      });
    }

    return filtered;
  };

  // Sorts todos (NOTE: this is done after the todos are split into
  // the different status e.g. Pending, hence the reason why it takes
  // an argument of an array of todos. These todos would be of the same
  // status.
  const sortTodos = (todos: todoType[]) => {
    if (sortBy === "name") {
      todos = todos.sort((a, b) => a.task.localeCompare(b.task));
    } else if (sortBy === "priority") {
      todos = todos.sort((a, b) => {
        if (a.priority > b.priority) {
          return -1;
        } else if (a.priority < b.priority) {
          return 1;
        }
        return 0;
      });
    }
    if (sortOrder === "descending") {
      todos = todos.reverse();
    }
    return todos;
  };

  useEffect(() => {
    if (auth) {
      handleFetchTodos();
    } else {
      setTodos(getTodosLS());
    }
  }, [auth]);

  useEffect(() => {
    if (!auth) {
      const notif = localStorage.getItem("loginNotification");
      if (!notif) {
        localStorage.setItem("loginNotification", "on");
        setLoginNotification(true);
      } else if (notif === "on") {
        setLoginNotification(true);
      } else {
        setLoginNotification(false);
      }
    } else {
      setLoginNotification(false);
    }
  });

  useEffect(() => {
    if (auth) {
      const todosLS = JSON.parse(localStorage.getItem("todos"));
      if (todosLS) {
        if (todosLS.length > 0) {
          setLSNotification(true);
        } else {
          setLSNotification(false);
        }
      } else {
        setLSNotification(false);
      }
    } else {
      setLSNotification(false);
    }
  }, [auth]);

  const numberOfOverdueTodos = todos.reduce((count, todo) => {
    return count + (!todo.isComplete && hasExceededEnd(todo) ? 1 : 0);
  }, 0);

  return (
    <>
      <CreateTodoDialog open={openDialog} setOpen={setOpenDialog} />

      <Stack
        gap="0.5rem"
        flex="1"
        sx={{
          overflowY: "auto",
          minHeight: "0",
          paddingY: "1rem",
          paddingX: {
            xs: "0.5rem",
            sm: "3rem",
            md: "5rem",
            lg: "10rem",
            xl: "15rem",
          },
        }}
      >
        {loginNotification && (
          <Alert
            severity="info"
            onClose={() => {
              setLoginNotification(false);
              localStorage.setItem("loginNotification", "off");
            }}
          >
            Your data is saved locally in this browser. Log in to save it to the
            cloud.
          </Alert>
          // <Notification
          //   icon={<IconExclamationMark />}
          //   onClose={() => {
          //     setLoginNotification(false);
          //     localStorage.setItem("loginNotification", "off");
          //   }}
          // >
          //   Your data is saved locally in this browser. Log in to save it to the
          //   cloud.
          // </Notification>
        )}
        {LSNotification && (
          <Alert
            // icon={<IconExclamationMark />}
            onClose={() => {
              setLSNotification(false);
            }}
          >
            You have some data saved in local storage. Would you like to
            transfer these to your account?
            <Button
              // size="compact-xs"
              onClick={() => {
                handleTransferLSTodosToDB();
                setLSNotification(false);
              }}
            >
              Yes
            </Button>
          </Alert>
          // <Notification
          //   icon={<IconExclamationMark />}
          //   onClose={() => {
          //     setLSNotification(false);
          //   }}
          // >
          //   You have some data saved in local storage. Would you like to transfer
          //   these to your account?
          //   <Button
          //     // size="compact-xs"
          //     onClick={handleTransferLSTodosToDB}
          //   >
          //     Yes
          //   </Button>
          // </Notification>
        )}
        {auth && (
          <Button
            style={{ alignSelf: "start" }}
            // size="compact-xs"
            disabled={synced ? true : false}
            onClick={handleSyncDB}
          >
            Sync to DB
          </Button>
        )}
        <Stack direction="row" justifyContent="center">
          <Stack alignItems="center" gap="0.5rem" flex="1">
            <CircularProgress
              size="2rem"
              variant="determinate"
              value={getPercentageOfCompletedPendingTodos(todos)}
              enableTrackSlot
            />
            <Typography>
              Current todos: {getCompletedPendingTodos(todos)} /{" "}
              {getCurrentTodos(todos).length}
            </Typography>
          </Stack>
          <Stack alignItems="center" gap="0.5rem" flex="1">
            <CircularProgress
              size="2rem"
              variant="determinate"
              value={getCompletedValue(todos)}
              enableTrackSlot
            />
            <Typography>
              All todos: {getNumberOfCompletedTodos(todos)} / {todos.length}
            </Typography>
          </Stack>
          {/* <Typography>All pending todos are complete!</Typography> */}
        </Stack>
        <DisplayOptions
          todos={todos}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          todoFilters={todoFilters}
          setTodoFilters={setTodoFilters}
          filterGroups={filterGroups}
          setFilterGroups={setFilterGroups}
        />
        <Divider />
        <Stack direction="row" gap="0.5rem">
          <Button
            onClick={() => setOpenDialog(true)}
            // style={{ alignSelf: "flex-start" }}
            // size="small"
            variant="outlined"
            // flex="1"
          >
            New Todo
          </Button>
          <TextField
            // size="sma"
            variant="outlined"
            // style={{ border: "1px solid green" }}
            size="small"
            placeholder="Enter todo ..."
            value={newTodo.task}
            onChange={(e) => setNewTodo({ ...newTodo, task: e.target.value })}
            style={{ flex: 1 }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        createTodo({
                          ...newTodo,
                          userId: auth ? auth._id : "",
                        });
                        if (auth) {
                          handleSaveToDB();
                        } else {
                          addTodoLS(newTodo);
                        }
                        resetTodo();
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            // flex="1"
          />
        </Stack>
        {numberOfOverdueTodos > 0 && (
          <Alert
            severity="error"
            style={{ padding: "0.2rem 0.75rem", opacity: "0.5" }}
          >
            You have {numberOfOverdueTodos} overdue{" "}
            {numberOfOverdueTodos === 1 ? "task" : "tasks"}.
          </Alert>
        )}
        <Stack flex="1" sx={{ overflowY: "auto", minHeight: "0" }} gap="0.5rem">
          {sortTodos(getFilteredTodos()).map((todo) => {
            return <TodoItem todo={todo} onDeleteTodoLS={handleDeleteTodoLS} />;
          })}
        </Stack>

        {/* <Group
        gap="xs"
        // mb="sm"
      ></Group> */}
        {/* </Stack> */}
      </Stack>
    </>
  );
};

export default HomePage;
