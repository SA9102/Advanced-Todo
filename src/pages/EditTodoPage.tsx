import {
  Button,
  Group,
  MultiSelect,
  Pill,
  PillsInput,
  SegmentedControl,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { Link, useParams } from "react-router";
import { useGetTodo, useTodoActions } from "../store/todoStore";
import { useState } from "react";
import { HOME } from "../routes/routes";
import tagType from "../types/tagType";
import { useGetTags } from "../store/tagStore";
import TagInput from "../components/TagInput";

const EditTodoPage = () => {
  const todoId = useParams().id; // Get the todo id from the url
  const todo = useGetTodo(todoId!);

  const [todoInput, setTodoInput] = useState(useGetTodo(todoId!));
  const { updateTodo } = useTodoActions();
  const tags = useGetTags();

  console.log(todo!.tags);

  return (
    <>
      <Title>Edit Todo</Title>
      <TextInput
        label="Task"
        value={todoInput.task}
        onChange={(e) => setTodoInput({ ...todoInput, task: e.target.value })}
      />
      <Textarea
        label="Description"
        value={todoInput.description}
        onChange={(e) =>
          setTodoInput({ ...todoInput, description: e.target.value })
        }
      />
      <Stack gap="xs">
        <Text size="sm">Priority</Text>
        <SegmentedControl
          withItemsBorders={false}
          data={[
            { label: "Low", value: "1" },
            { label: "Medium", value: "2" },
            { label: "High", value: "3" },
          ]}
          value={todoInput.priority}
          onChange={(e) =>
            setTodoInput({ ...todoInput, priority: e as "1" | "2" | "3" })
          }
        />
      </Stack>
      <TagInput todoInput={todoInput} setTodoInput={setTodoInput} />
      <Group>
        <Button flex="1" variant="default" component={Link} to={HOME}>
          Cancel
        </Button>
        <Button
          flex="1"
          component={Link}
          to={HOME}
          onClick={() => {
            updateTodo(todoInput);
          }}
        >
          Save
        </Button>
      </Group>
    </>
  );
};

export default EditTodoPage;
