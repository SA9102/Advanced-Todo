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
import { deleteTodoLS, getTagsLS, updateTodoLS } from "../utils/localStorage";
import { hasExceededStart, hasExceededEnd } from "../utils/todoUtils";
import useDatabase from "../hooks/useDatabase";

type props = {
  todo: todoType;
};

// Renders a todo item
const TodoItem = ({ todo }: props) => {
  const { updateTodo, checkTodo, deleteTodo, changeTask, toggleExpandTodo } =
    useTodoActions();

  const { updateTodoDB, deleteTodoDB } = useDatabase();

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

  const setSynced = useSetSynced();

  const [allTags, setAllTags] = useState([]);

  const [newTodo, setNewTodo] = useState(todo);

  const [tagsFetched, setTagsFetched] = useState(false);

  const { auth } = useContext(AuthContext);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const open = Boolean(menuAnchor);
  const handleClick = (e) => {
    setMenuAnchor(e.currentTarget);
  };
  const handleClose = () => {
    setMenuAnchor(null);
  };

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
      const tagsLS = getTagsLS();
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

  const status = getStatus();
  return (
    <Stack>
      <Card
        elevation={0}
        style={{
          borderLeft:
            "2px solid " +
            (todo.priority === "1"
              ? "#008f49"
              : todo.priority === "2"
              ? "#946426"
              : "#9c3232"),
        }}
        key={todo.taskId}
      >
        <Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            flexWrap="nowrap"
          >
            {todo.isChangingTask ? (
              <Stack direction="row">
                <TextField
                  value={newTodo.task}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, task: e.target.value })
                  }
                />
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConfirmChangeTask();
                  }}
                >
                  <CheckIcon />
                </IconButton>
                <IconButton
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
                    if (auth) {
                      updateTodoDB(todo);
                    } else {
                      updateTodoLS(todo);
                    }
                    setSynced(false);
                  }}
                />
                <Typography>{todo.task}</Typography>
              </Stack>
            )}
            <Stack direction="row" alignItems="center">
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
                >
                  {todo.isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              )}
              <IconButton onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu anchorEl={menuAnchor} onClose={handleClose} open={open}>
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
                <MenuItem
                  onClick={(e) => {
                    handleClose();
                    e.stopPropagation();
                    deleteTodo(todo.taskId);
                    if (auth) {
                      deleteTodoDB(todo.taskId);
                    } else {
                      deleteTodoLS(todo.taskId);
                    }
                    setSynced(false);
                  }}
                >
                  <ListItemIcon>
                    <DeleteIcon />
                  </ListItemIcon>
                  <ListItemText>Delete</ListItemText>
                </MenuItem>
              </Menu>
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
            </Stack>
          )}
        </Stack>
      </Card>
      <EditTodoModal open={openDialog} setOpen={setOpenDialog} todo={todo} />
    </Stack>
  );
};

export default TodoItem;
