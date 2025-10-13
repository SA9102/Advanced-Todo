import todoType from "../types/todoType";
import { useTodoActions } from "../store/todoStore";
import { useLongPress } from "use-long-press";
import {
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconDotsVertical,
  IconX,
} from "@tabler/icons-react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditNoteIcon from "@mui/icons-material/EditNote";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { useGetLayout } from "../store/layoutStore";
import tagType from "../types/tagType";
import { useGetTags, useTagActions } from "../store/tagStore";
import { useSynced, useSetSynced } from "../store/syncStore";
import axios from "axios";
import { API_BASE_URL } from "../config";
import AuthContext from "../context/AuthProvider";
import {
  Button,
  Card,
  Checkbox,
  Chip,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AnimatePresence, motion } from "motion/react";
import EditTodoModal from "./EditTodoDialog";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type props = {
  todo: todoType;
};

const options = {
  weekday: "short",
  month: "short",
  day: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
};

// Renders a todo item
const TodoItem = ({ todo, onDeleteTodoLS }: props) => {
  const { updateTodo, checkTodo, deleteTodo, changeTask, toggleExpandTodo } =
    useTodoActions();

  const [openDialog, setOpenDialog] = useState(false);

  const getStatus = () => {
    if (!todo.isComplete && hasExceededStart(todo) && !hasExceededEnd(todo)) {
      return "pending";
    } else if (!todo.isComplete && !hasExceededStart(todo)) {
      return "upcoming";
    } else if (!todo.isComplete && hasExceededEnd(todo)) {
      return "overdue";
    } else if (todo.isComplete) {
      return "completed";
    }
  };

  const { setTags } = useTagActions();

  const sync = useSynced();
  const setSynced = useSetSynced();

  // const allTags: tagType[] = useGetTags();
  const [allTags, setAllTags] = useState([]);

  const [newTodo, setNewTodo] = useState(todo);

  const [tagsFetched, setTagsFetched] = useState(false);

  const { auth } = useContext(AuthContext);

  const layout = useGetLayout();

  const [menuAnchor, setMenuAnchor] = useState(null);
  const open = Boolean(menuAnchor);
  const handleClick = (e) => {
    setMenuAnchor(e.currentTarget);
  };
  const handleClose = () => {
    setMenuAnchor(null);
  };

  const longPress = useLongPress(() => {
    console.log("Long pressed!");
  });

  // If 'Save' is pressed when editing
  const handleConfirmChangeTask = () => {
    updateTodo(newTodo);
    setNewTodo(newTodo);
    changeTask(todo.taskId, false);
    setSynced(false);
  };

  // If 'Cancel' is pressed when editing
  const handleCancelChangeTask = () => {
    setNewTodo(todo);
    changeTask(todo.taskId, false);
  };

  // Return the colour based on the todo item's priority
  const getPriorityColour = () => {
    switch (todo.priority) {
      case "1":
        return "green";
      case "2":
        return "yellow";
      case "3":
        return "red";
    }
  };

  // Check if the todo has some text as its description
  const hasDescription = () => {
    return todo.description.trim() !== "";
  };

  // Check if the todo has at least one tag with it
  const hasTags = () => {
    return todo.tags.length > 0;
  };

  // Check if todo has a start datetime specified

  const hasStart = () => todo.start !== null;

  // Check if todo has an end datetime specified
  const hasEnd = () => todo.end !== null;

  // A todo item can only be expanded if it contains more information other
  // than the task
  const canBeExpanded = () => {
    return hasDescription() || hasTags() || hasEnd();
  };

  function formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  // const iconColor = colorScheme === "light" ? "gray" : "white";

  useEffect(() => {
    const handleFetchTags = async () => {
      try {
        const data = await axios.get(`${API_BASE_URL}/tag`, {
          withCredentials: true,
          headers: { Authorization: auth.accessToken },
        });
        const tags = data.data.data;
        setAllTags(tags);
        setTagsFetched(true);
      } catch (err) {
        console.error(err);
      }
    };

    const handleFetchTagsLS = () => {
      let tagsLS = JSON.parse(localStorage.getItem("tags"));
      if (!tagsLS) {
        tagsLS = [];
      }
      setTags(tagsLS);
      setAllTags(tagsLS);
      setTagsFetched(true);
    };

    if (auth) {
      handleFetchTags();
    } else {
      handleFetchTagsLS();
    }
  }, []);

  // console.log

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

  const status = getStatus();
  console.log("--- STATUS ---");
  console.log(status);
  return (
    <Stack>
      <AnimatePresence>
        <Card
          elevation={0}
          // component={motion.div}
          // initial={{ scale: 0.95 }}
          // animate={{ scale: 1 }}
          style={{
            // backgroundColor: "#212121",
            borderLeft:
              "2px solid " +
              (todo.priority === "1"
                ? "#008f49"
                : todo.priority === "2"
                ? "#946426"
                : "#9c3232"),
          }}
          // style={{
          //   borderLeft: `2px solid var(--mantine-color-${getPriorityColour()}-9)`,
          //   flexGrow: "1",
          //   display: "inline-block",
          //   width: "100%",
          // }}
          key={todo.taskId}
          // shadow="xs"
          // px="xs"
          // py="0.4rem"
          // flex="1"
          // onClick={() => checkTodo(todo.taskId)}
          {...longPress()}
        >
          <Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              flexWrap="nowrap"
            >
              {todo.isChangingTask ? (
                <Stack
                  direction="row"
                  // wrap="nowrap"
                  // bgcolor="red"
                >
                  <TextField
                    // size="xs"
                    value={newTodo.task}
                    onChange={(e) =>
                      setNewTodo({ ...newTodo, task: e.target.value })
                    }
                  />
                  <IconButton
                    // size="xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfirmChangeTask();
                    }}
                  >
                    <CheckIcon />
                  </IconButton>
                  <IconButton
                    // size="xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelChangeTask();
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Stack>
              ) : (
                <Stack direction="row" alignItems="center">
                  <Checkbox
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<CheckCircleIcon />}
                    size="small"
                    checked={todo.isComplete}
                    onClick={() => {
                      checkTodo(todo.taskId);
                      setSynced(false);
                    }}
                  />
                  <Typography
                  // size="sm"
                  // style={{
                  //   whiteSpace: "nowrap",
                  //   overflow: "hidden",
                  //   textOverflow: "ellipsis",
                  //   flex: 1,
                  //   minWidth: 0,
                  // }}
                  >
                    {todo.task}
                  </Typography>
                </Stack>
              )}
              <Stack
                direction="row"
                alignItems="center"
                // wrap="nowrap"
              >
                {/* ebdb8f */}
                <Typography
                  variant="body2"
                  style={{
                    color:
                      status === "pending"
                        ? "#ebdb8f"
                        : status === "upcoming"
                        ? "#84dfe0"
                        : status === "overdue"
                        ? "#e08484"
                        : "#8ae386",
                  }}
                >
                  {status === "pending"
                    ? "Pending"
                    : status === "upcoming"
                    ? "Upcoming"
                    : status === "overdue"
                    ? "Overdue"
                    : "Completed"}
                </Typography>
                {canBeExpanded() && (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpandTodo(todo.taskId);
                    }}
                    // variant="transparent"
                    // size="xs"
                  >
                    {todo.isExpanded ? (
                      // <IconChevronUp color={iconColor} />
                      <ExpandLessIcon />
                    ) : (
                      // <IconChevronDown color={iconColor} />
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                )}
                <IconButton onClick={handleClick}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  // variant="menu"
                  anchorEl={menuAnchor}
                  onClose={handleClose}
                  open={open}
                >
                  <MenuItem
                    onClick={(e) => {
                      handleClose();
                      e.stopPropagation();
                      setOpenDialog(true);
                    }}
                  >
                    <ListItemIcon>
                      <EditDocumentIcon />
                    </ListItemIcon>
                    <ListItemText>Edit Todo</ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      handleClose();
                      e.stopPropagation();
                      changeTask(todo.taskId, true);
                    }}
                  >
                    <ListItemIcon>
                      <EditIcon />
                    </ListItemIcon>
                    <ListItemText>Change Task</ListItemText>
                  </MenuItem>
                  {/* <Link to={todo.taskId}>
                    <MenuItem
                      onClick={() => {
                        handleClose;
                      }}
                    >
                      <ListItemIcon>
                        <EditNoteIcon />
                      </ListItemIcon>
                      <ListItemText>Edit</ListItemText>
                    </MenuItem>
                  </Link> */}
                  <MenuItem
                    onClick={(e) => {
                      handleClose();
                      e.stopPropagation();
                      deleteTodo(todo.taskId);
                      onDeleteTodoLS(todo.taskId);
                      setSynced(false);
                    }}
                  >
                    <ListItemIcon>
                      <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                  </MenuItem>
                </Menu>
                {/* <Menu>
                <Menu.Target>
                  <ActionIcon
                    variant="transparent"
                    size="xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IconDotsVertical color={iconColor} />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      changeTask(todo.taskId, true);
                    }}
                  >
                    Change Task
                  </Menu.Item>
                  <Link to={todo.taskId}>
                    <Menu.Item>Edit</Menu.Item>
                  </Link>
                  <Menu.Item
                    color="red"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTodo(todo.taskId);
                      setSynced(false);
                    }}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu> */}
              </Stack>
            </Stack>

            {todo.isExpanded && tagsFetched && (
              <Stack px="1rem" py="0.5rem" gap="0.5rem">
                {hasDescription() && (
                  <Typography fontSize="0.7rem">{todo.description}</Typography>
                )}
                {hasStart() && (
                  <Typography fontSize="0.7rem">
                    Start:{" "}
                    {new Date(todo.start!).toLocaleDateString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </Typography>
                )}
                {hasEnd() && (
                  <Typography fontSize="0.7rem">
                    End:{" "}
                    {new Date(todo.end!).toLocaleDateString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </Typography>
                )}
                {hasTags() && (
                  <Stack direction="row" gap="0.5rem">
                    {todo.tags.map((tagId) => {
                      const tagObj = allTags.find((tag) => tag.tagId === tagId);
                      if (tagObj) {
                        return (
                          <Chip
                            style={{ fontSize: "0.7rem" }}
                            size="small"
                            label={tagObj.label}
                          />
                        );
                      }
                    })}
                  </Stack>
                )}
                {/* {hasTags() && (
                <Pill.Group>
                  {todo.tags.map((tagId) => {
                    const tagObj = allTags.find((tag) => tag.tagId === tagId);
                    if (tagObj) {
                      return (
                        <Pill
                          size="xs"
                          key={tagObj!.tagId}
                          style={{
                            backgroundColor: tagObj!.colour,
                          }}
                        >
                          {tagObj!.label}
                        </Pill>
                      );
                    }
                  })}
                </Pill.Group>
              )} */}
              </Stack>
            )}
          </Stack>
        </Card>
      </AnimatePresence>
      <EditTodoModal open={openDialog} setOpen={setOpenDialog} todo={todo} />
    </Stack>
  );
};

export default TodoItem;
