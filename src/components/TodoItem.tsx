import {
  Card,
  Group,
  Checkbox,
  Text,
  ActionIcon,
  Button,
  Menu,
  TextInput,
} from "@mantine/core";
import todoType from "../types/todoType";
import { useTodoActions } from "../store/todoStore";
import { useLongPress } from "use-long-press";
import {
  IconCancel,
  IconCheck,
  IconDotsVertical,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";

type props = {
  todo: todoType;
};

// Renders a todo item
const TodoItem = ({ todo }: props) => {
  const { updateTodo, checkTodo, deleteTodo, changeTask } = useTodoActions();
  const [newTodo, setNewTodo] = useState(todo);

  const longPress = useLongPress(() => {
    console.log("Long pressed!");
  });

  const handleConfirmChangeTask = () => {
    updateTodo(newTodo);
    setNewTodo(newTodo);
    changeTask(todo.id, false);
  };

  const handleCancelChangeTask = () => {
    setNewTodo(todo);
    changeTask(todo.id, false);
  };

  return (
    <>
      <Card key={todo.id} shadow="xs" padding="xs" {...longPress()}>
        <Group justify="space-between">
          <Group>
            {todo.isChangingTask ? (
              <>
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
              </>
            ) : (
              <>
                <Checkbox
                  checked={todo.isComplete}
                  onChange={() => checkTodo(todo.id)}
                />
                <Text>{todo.task}</Text>
              </>
            )}
          </Group>
          <Menu>
            <Menu.Target>
              <ActionIcon variant="transparent" size="xs">
                <IconDotsVertical />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item onClick={() => changeTask(todo.id, true)}>
                Change Task
              </Menu.Item>
              <Menu.Item>Edit</Menu.Item>
              <Menu.Item color="red" onClick={() => deleteTodo(todo.id)}>
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card>
    </>
  );
};

export default TodoItem;
