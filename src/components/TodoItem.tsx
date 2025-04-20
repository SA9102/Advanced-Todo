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
import { useState } from "react";
import { Link } from "react-router";

type props = {
  todo: todoType;
};

// Renders a todo item
const TodoItem = ({ todo }: props) => {
  const { updateTodo, checkTodo, deleteTodo, changeTask, toggleExpandTodo } =
    useTodoActions();
  const [newTodo, setNewTodo] = useState(todo);

  const longPress = useLongPress(() => {
    console.log("Long pressed!");
  });

  // If 'Save' is pressed when editing
  const handleConfirmChangeTask = () => {
    updateTodo(newTodo);
    setNewTodo(newTodo);
    changeTask(todo.id, false);
  };

  // If 'Cancel' is pressed when editing
  const handleCancelChangeTask = () => {
    setNewTodo(todo);
    changeTask(todo.id, false);
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
    console.log("HAS TAGS");
    console.log(todo.tags.length);
    return todo.tags.length > 0;
  };

  // A todo item can only be expanded if it contains more information other
  // than the task
  const canBeExpanded = () => {
    return hasDescription() || hasTags();
  };

  return (
    <>
      <Card
        style={{
          borderLeft: `2px solid var(--mantine-color-${getPriorityColour()}-9)`,
        }}
        key={todo.id}
        shadow="xs"
        padding="xs"
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
                <ActionIcon size="xs" onClick={handleConfirmChangeTask}>
                  <IconCheck />
                </ActionIcon>
                <ActionIcon size="xs" onClick={handleCancelChangeTask}>
                  <IconX />
                </ActionIcon>
              </Group>
            ) : (
              <Group style={{ flex: 1, overflow: "hidden" }} wrap="nowrap">
                <Checkbox
                  size="xs"
                  checked={todo.isComplete}
                  onChange={() => checkTodo(todo.id)}
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
                  onClick={() => toggleExpandTodo(todo.id)}
                  variant="transparent"
                  size="xs"
                >
                  {todo.isExpanded ? (
                    <IconChevronUp color="white" />
                  ) : (
                    <IconChevronDown color="white" />
                  )}
                </ActionIcon>
              )}
              <Menu>
                <Menu.Target>
                  <ActionIcon variant="transparent" size="xs">
                    <IconDotsVertical color="white" />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item onClick={() => changeTask(todo.id, true)}>
                    Change Task
                  </Menu.Item>
                  <Link to={todo.id}>
                    <Menu.Item>Edit</Menu.Item>
                  </Link>
                  <Menu.Item color="red" onClick={() => deleteTodo(todo.id)}>
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>

          {todo.isExpanded && (
            <>
              {hasDescription() && <Text size="xs">{todo.description}</Text>}
              {hasTags() && (
                <Pill.Group>
                  {todo.tags.map((tag) => (
                    <Pill size="xs" key={tag}>
                      {tag}
                    </Pill>
                  ))}
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
