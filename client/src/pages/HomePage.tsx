import {
  ActionIcon,
  Button,
  Group,
  NativeSelect,
  Notification,
  Progress,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
  VisuallyHidden,
} from "@mantine/core";
import {
  IconLayout2Filled,
  IconLayoutListFilled,
  IconPlus,
  IconExclamationMark,
} from "@tabler/icons-react";
import todoType from "../types/todoType";
import { useGetTodos, useTodoActions } from "../store/todoStore";
import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import FiltersInput from "../components/FiltersInput";
import emptyTodo from "../utils/emptyTodo";
import todoFiltersType from "../types/todoFiltersType";
import emptyTodoFilters from "../utils/emptyTodoFilters";

import TodoSection from "../components/TodoSection";
import axios from "axios";
import { API_BASE_URL } from "../config";
import useCheckAuth from "../hooks/useCheckAuth";
import { useSetSynced, useSynced } from "../store/syncStore";
import updateDB from "../utils/updateDB";
import useSyncDB from "../hooks/useSyncDB";
import useCheckAuthNew from "../hooks/useCheckAuthNew";
import AuthContext from "../context/AuthProvider";
import { Link, useNavigate } from "react-router";
import useRefreshToken from "../hooks/useRefreshToken";
import usePersistLogin from "../hooks/usePersistLogin";
import { CREATE_TAG } from "../routes/routes";
import DisplayOptions from "../components/DisplayOptions";

const HomePage = () => {
  // Get all todos from store
  const todos: todoType[] = useGetTodos();
  // const [todos, setTodos] = useState<todoType[]>([]);
  const synced = useSynced();
  const setSynced = useSetSynced();
  // Function for creating a todo
  const { createTodo, setTodos } = useTodoActions();

  const { auth } = useContext(AuthContext);

  // Input for adding a new todo
  const [newTodo, setNewTodo] = useState<todoType>(emptyTodo);
  // Input for todo filters
  const [todoFilters, setTodoFilters] =
    useState<todoFiltersType>(emptyTodoFilters);
  // The different 'states' that a todo item can be in
  const [filterGroups, setFilterGroups] = useState([
    "Pending",
    "Completed",
    "Upcoming",
    "Overdue",
  ]);
  // By what the todos are sorted
  const [sortBy, setSortBy] = useState<"name" | "priority">("priority");
  console.log("AUTH");
  console.log(auth);
  const [loginNotification, setLoginNotification] = useState(
    !auth && localStorage.getItem("loginNotification") === "on" ? true : false
  );

  const [LSNotification, setLSNotification] = useState(false);

  console.log("LSNotification");
  console.log(LSNotification);

  const refresh = useRefreshToken();

  // Checks if the user is logged in, and if so then get their todos.
  // useCheckAuth();
  console.log("TODOS -----------");
  console.log(todos);
  const handleSyncDB = async () => {
    console.log("1");
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
      console.log("2");
      setSynced(true);
    } catch (err) {
      console.log("3");
      console.log(err);
    }
  };

  const handleSaveToLS = () => {
    let todosLS = JSON.parse(localStorage.getItem("todos"));
    todosLS = [...todosLS, { ...newTodo, userId: "" }];
    localStorage.setItem("todos", JSON.stringify(todosLS));
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

  // Fetches todos that are saved to local storage if the user is
  // not logged in
  const handleFetchTodosLS = () => {
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

        return { ...todo, start, end };
      });
      setTodos(todosLS);
    } else {
      setTodos([]);
    }
    console.log(todosLS);
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
        console.log("2");
        setTodos(newTodos);
        localStorage.setItem("todos", JSON.stringify([]));
      } catch (err) {
        console.log("3");
        console.log(err);
      }
    }
  };

  // Set the current todo input to empty
  const resetTodo = () => {
    setNewTodo({ ...emptyTodo, taskId: uuidv4() });
  };

  // // Get the number of todos that have been checked off as completed
  // const getNumberOfCompletedTodos = () => {
  //   return todos.filter((todo: todoType) => todo.isComplete).length;
  // };

  // // Get percentage of completed todos
  // const getCompletedValue = () => {
  //   return (getNumberOfCompletedTodos() / todos.length) * 100;
  // };

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

    return todos;
  };

  // Check if the todo item has a start date and, if it does then check
  // if the current time is past this start date.
  const hasExceededStart = (todo: todoType) => {
    if (todo.start !== null) {
      const todoStart = new Date(todo.start);
      if (Date.now() >= todoStart.getTime()) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  // Check if the todo item has an end date and, if it does then check
  // if the current time is past this end date.
  const hasExceededEnd = (todo: todoType) => {
    if (todo.end !== null) {
      const todoEnd = new Date(todo.end);
      if (Date.now() >= todoEnd.getTime()) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  // Organises the todos into their statuses, namely 'Pending', 'Upcoming',
  // 'Overdue' and 'Complete'. (NOTE: this is done AFTER the todos have been
  // filtered, to avoid unnecessary allocation of todos.).
  const organiseTodosByStatus = () => {
    let pending: todoType[] = [];
    let upcoming: todoType[] = [];
    let overdue: todoType[] = [];
    let completed: todoType[] = [];
    const filteredTodos = getFilteredTodos();

    for (let i = 0; i < filteredTodos.length; i++) {
      const todo = filteredTodos[i];
      if (!todo.isComplete && hasExceededStart(todo) && !hasExceededEnd(todo)) {
        pending = [...pending, todo];
      } else if (!todo.isComplete && !hasExceededStart(todo)) {
        upcoming = [...upcoming, todo];
      } else if (!todo.isComplete && hasExceededEnd(todo)) {
        overdue = [...overdue, todo];
      } else if (todo.isComplete) {
        completed = [...completed, todo];
      }
    }

    return [
      { status: "Pending", todos: sortTodos(pending) },
      { status: "Upcoming", todos: sortTodos(upcoming) },
      { status: "Overdue", todos: sortTodos(overdue) },
      { status: "Completed", todos: sortTodos(completed) },
    ];
  };

  // useCheckAuthNew();
  console.log("FILTER GROUPS");
  console.log(filterGroups);

  useEffect(() => {
    if (auth) {
      handleFetchTodos();
    } else {
      handleFetchTodosLS();
    }
  }, [auth]);

  useEffect(() => {
    if (auth) {
      const todosLS = localStorage.getItem("todos");
      if (todosLS) {
        setLSNotification(true);
      } else {
        setLSNotification(false);
      }
    } else {
      setLSNotification(false);
    }
  }, [auth]);

  return (
    <>
      {loginNotification && (
        <Notification
          icon={<IconExclamationMark />}
          onClose={() => {
            setLoginNotification(false);
            localStorage.setItem("loginNotification", "off");
          }}
        >
          Your data is saved locally in this browser. Log in to save it to the
          cloud.
        </Notification>
      )}
      {LSNotification && (
        <Notification
          icon={<IconExclamationMark />}
          onClose={() => {
            setLSNotification(false);
          }}
        >
          You have some data saved in local storage. Would you like to transfer
          these to your account?
          <Button size="compact-xs" onClick={handleTransferLSTodosToDB}>
            Yes
          </Button>
        </Notification>
      )}

      {auth && (
        <Button
          style={{ alignSelf: "start" }}
          size="compact-xs"
          disabled={synced ? true : false}
          onClick={handleSyncDB}
        >
          Sync to DB
        </Button>
      )}
      <DisplayOptions
        todos={todos}
        sortBy={sortBy}
        setSortBy={setSortBy}
        todoFilters={todoFilters}
        setTodoFilters={setTodoFilters}
        filterGroups={filterGroups}
        setFilterGroups={setFilterGroups}
      />
      <Group>
        <TextInput
          size="xs"
          placeholder="Enter todo ..."
          value={newTodo.task}
          onChange={(e) => setNewTodo({ ...newTodo, task: e.target.value })}
          flex="1"
        />
        <ActionIcon
          size="md"
          onClick={() => {
            createTodo({ ...newTodo, userId: auth ? auth._id : "" });
            if (!auth) {
              handleSaveToLS();
            }
            resetTodo();
          }}
        >
          <IconPlus />
        </ActionIcon>
      </Group>
      {/* Main part */}
      <Stack flex="1" style={{ overflow: "auto" }}>
        {organiseTodosByStatus().map((val) => {
          console.log("VAL");
          console.log(val);
          if (filterGroups.includes(val.status)) {
            return (
              <TodoSection
                key={val.status}
                todos={val.todos}
                status={val.status}
              />
            );
          }
        })}
      </Stack>
      <Group
        gap="xs"
        // mb="sm"
      ></Group>
      <Group gap="xs">
        <Button size="xs" variant="outline" flex="1">
          New Todo
        </Button>
        <Button
          size="xs"
          variant="outline"
          flex="1"
          component={Link}
          to={CREATE_TAG}
        >
          New Tag
        </Button>
      </Group>
    </>
  );
};

export default HomePage;
