// Renders all the available tags, which the user can edit or delete.

import { ActionIcon, Button, Card, Group, Text } from "@mantine/core";
import { useGetTags, useTagActions } from "../store/tagStore";
import { IconTrash } from "@tabler/icons-react";
import { useGetTodos, useTodoActions } from "../store/todoStore";

const EditTagsPage = () => {
  const allTodos = useGetTodos();
  const allTags = useGetTags(); // Get all available tags from store
  const { updateTodo } = useTodoActions();
  const { deleteTag } = useTagActions();

  const removeTagFromTodos = (tagId: string) => {
    let updatedTodos = [...allTodos];

    updatedTodos = updatedTodos.map((todo) => {
      todo.tags = todo.tags.filter((tId) => tId !== tagId);

      if (todo.tags.length === 0) {
        todo.isExpanded = false;
      }
      updateTodo(todo);
      return todo;
    });
  };

  return (
    <>
      <Button variant="light">New Tag</Button>
      {allTags.map((tagObj) => (
        <Card>
          {/* <Card style={{ backgroundColor: tagObj.colour }}> */}
          <Group>
            <Text>{tagObj.name}</Text>
            <ActionIcon
              color="red"
              size="sm"
              onClick={() => {
                deleteTag(tagObj.id);
                removeTagFromTodos(tagObj.id);
              }}
            >
              <IconTrash />
            </ActionIcon>
          </Group>
        </Card>
      ))}
    </>
  );
};

export default EditTagsPage;
