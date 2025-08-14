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
import { Link, useNavigate, useParams } from "react-router";
import { useGetTodo, useTodoActions } from "../store/todoStore";
import { useContext, useState } from "react";
import { HOME } from "../routes/routes";
import tagType from "../types/tagType";
import { useGetTags } from "../store/tagStore";
import TagInput from "../components/TagInput";
import { DatePickerInput, DateTimePicker } from "@mantine/dates";
import axios from "axios";
import { API_BASE_URL } from "../config";
import AuthContext from "../context/AuthProvider";

const EditTodoPage = () => {
  const todoId = useParams().id; // Get the todo id from the url
  const todo = useGetTodo(todoId!);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [todoInput, setTodoInput] = useState(useGetTodo(todoId!));
  const { updateTodo } = useTodoActions();
  const tags = useGetTags();

  const handleSaveToDB = async () => {
    try {
      // await axios.put(`${API_BASE_URL}/`)
      console.log("TODO TAGS");
      console.log(todoInput.tags);
      await axios.patch(
        `${API_BASE_URL}/todo`,

        {
          _id: auth._id,
          username: auth.username,
          data: {
            taskId: todoInput?.taskId,
            task: todoInput?.task,
            description: todoInput?.description,
            tags: todoInput?.tags,
            isComplete: todoInput?.isComplete,
            userId: todoInput?.userId,
            priority: "2",
            start: todoInput?.start,
            end: todoInput?.end,
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
  console.log("TODO INPUT");
  console.log(todoInput);
  return (
    <>
      {todoInput ? (
        <>
          <TextInput
            label="Task"
            value={todoInput.task}
            onChange={(e) =>
              setTodoInput({ ...todoInput, task: e.target.value })
            }
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
          <DateTimePicker
            label="Start"
            valueFormat="DD MMMM YYYY H:mm"
            value={todoInput.start}
            onChange={(newStart) => {
              setTodoInput({ ...todoInput, start: newStart });
            }}
            clearable
          />
          <DateTimePicker
            label="End"
            valueFormat="DD MMMM YYYY H:mm"
            value={todoInput.end}
            onChange={(newEnd) => setTodoInput({ ...todoInput, end: newEnd })}
            clearable
          />
          <TagInput todoInput={todoInput} setTodoInput={setTodoInput} />
          <Group>
            <Button flex="1" variant="outline" component={Link} to={HOME}>
              Cancel
            </Button>
            <Button
              flex="1"
              onClick={() => {
                updateTodo(todoInput);
                handleSaveToDB();
              }}
            >
              Save
            </Button>
          </Group>
        </>
      ) : (
        <p>Not found</p>
      )}
    </>
  );
};

export default EditTodoPage;
