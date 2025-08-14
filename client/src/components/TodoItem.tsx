import {
  Card,
  Group,
  Checkbox,
  Text,
  ActionIcon,
  Button,
  Menu,
  TextInput,
  Stack,
  Pill,
  useMantineColorScheme,
} from "@mantine/core";
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
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { useGetLayout } from "../store/layoutStore";
import tagType from "../types/tagType";
import { useGetTags } from "../store/tagStore";
import { useSynced, useSetSynced } from "../store/syncStore";
import axios from "axios";
import { API_BASE_URL } from "../config";
import AuthContext from "../context/AuthProvider";

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
const TodoItem = ({ todo }: props) => {
  const { updateTodo, checkTodo, deleteTodo, changeTask, toggleExpandTodo } =
    useTodoActions();

  const sync = useSynced();
  const setSynced = useSetSynced();

  // const allTags: tagType[] = useGetTags();
  const [allTags, setAllTags] = useState([]);

  const [newTodo, setNewTodo] = useState(todo);

  const [tagsFetched, setTagsFetched] = useState(false);

  const { auth } = useContext(AuthContext);

  const layout = useGetLayout();

  const { colorScheme } = useMantineColorScheme();

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

  const iconColor = colorScheme === "light" ? "gray" : "white";

  console.log("IS EXPANDED??");
  console.log(todo.isExpanded);

  useEffect(() => {
    const handleFetchTags = async () => {
      try {
        const data = await axios.get(`${API_BASE_URL}/tag`, {
          withCredentials: true,
          headers: { Authorization: auth.accessToken },
        });
        const tags = data.data.data;
        console.log("TAGS HAVE BEEN FETCHED !!!");
        setAllTags(tags);
        setTagsFetched(true);
      } catch (err) {
        console.log("NO TAGS FETCHED !!!");
        console.error(err);
      }
    };

    handleFetchTags();
  }, []);

  console.log("TAGS FETCHED");
  console.log(tagsFetched);
  return (
    <>
      <Card
        style={{
          borderLeft: `2px solid var(--mantine-color-${getPriorityColour()}-9)`,
          flexGrow: "1",
          display: "inline-block",
          width: "100%",
        }}
        key={todo.taskId}
        shadow="xs"
        px="xs"
        py="0.4rem"
        // flex="1"
        // onClick={() => checkTodo(todo.taskId)}
        {...longPress()}
      >
        <Stack>
          <Group justify="space-between" wrap="nowrap">
            {todo.isChangingTask ? (
              <Group wrap="nowrap">
                <TextInput
                  size="xs"
                  value={newTodo.task}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, task: e.target.value })
                  }
                />
                <ActionIcon
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConfirmChangeTask();
                  }}
                >
                  <IconCheck />
                </ActionIcon>
                <ActionIcon
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelChangeTask();
                  }}
                >
                  <IconX />
                </ActionIcon>
              </Group>
            ) : (
              <Group>
                <Checkbox
                  checked={todo.isComplete}
                  onClick={() => {
                    checkTodo(todo.taskId);
                    setSynced(false);
                  }}
                />
                <Text
                  size="sm"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {todo.task}
                </Text>
              </Group>
            )}
            <Group wrap="nowrap">
              {canBeExpanded() && (
                <ActionIcon
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpandTodo(todo.taskId);
                  }}
                  variant="transparent"
                  size="xs"
                >
                  {todo.isExpanded ? (
                    <IconChevronUp color={iconColor} />
                  ) : (
                    <IconChevronDown color={iconColor} />
                  )}
                </ActionIcon>
              )}
              <Menu>
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
              </Menu>
            </Group>
          </Group>

          {todo.isExpanded && tagsFetched && (
            <>
              {hasDescription() && <Text size="xs">{todo.description}</Text>}
              {hasStart() && (
                <Text size="xs">
                  Start:{" "}
                  {new Date(todo.start!).toLocaleDateString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </Text>
              )}
              {hasEnd() && (
                <Text size="xs">
                  End:{" "}
                  {new Date(todo.end!).toLocaleDateString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </Text>
              )}
              {hasTags() && (
                <Pill.Group>
                  {todo.tags.map((tagId) => {
                    const tagObj = allTags.find((tag) => tag.tagId === tagId);
                    console.log("PRINTING TAGOBJ");
                    console.log(tagObj);
                    return (
                      <Pill
                        size="xs"
                        key={tagObj!.tagId}
                        style={{ backgroundColor: tagObj!.colour }}
                      >
                        {tagObj!.label}
                      </Pill>
                    );
                  })}
                </Pill.Group>
              )}
            </>
          )}
        </Stack>
      </Card>
    </>
  );
};

export default TodoItem;
