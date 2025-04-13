import {
  Card,
  Group,
  Checkbox,
  Text,
  ActionIcon,
  Button,
  Menu,
} from "@mantine/core";
import todoType from "../types/todoType";
import { useTodoActions } from "../store/todoStore";
import { useLongPress } from "use-long-press";
import { IconDotsVertical } from "@tabler/icons-react";

type props = {
  todo: todoType;
};

// Renders a todo item
const TodoItem = ({ todo }: props) => {
  const {checkTodo, deleteTodo} = useTodoActions()

  const longPress = useLongPress(() => {
    console.log("Long pressed!");
  });

  return (
    <>
      <Card key={todo.id} shadow="xs" padding="xs" {...longPress()}>
        <Group justify="space-between">
          <Group>
            <Checkbox
              checked={todo.isComplete}
              onChange={() => checkTodo(todo.id)}
            />
            <Text onClick={() => checkTodo(todo.id)}>{todo.name}</Text>
          </Group>
          <Menu>
            <Menu.Target>
              <ActionIcon variant="transparent" size="xs">
                <IconDotsVertical />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item>Edit</Menu.Item>
              <Menu.Item color="red" onClick={() => deleteTodo(todo.id)}>Delete</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card>
    </>
  );
};

export default TodoItem;
