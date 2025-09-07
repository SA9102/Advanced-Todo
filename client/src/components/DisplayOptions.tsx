import {
  Button,
  Collapse,
  NativeSelect,
  Progress,
  SegmentedControl,
  Stack,
  Text,
  useMantineTheme,
  VisuallyHidden,
} from "@mantine/core";
import {
  IconAdjustmentsHorizontal,
  IconLayout2Filled,
  IconLayoutListFilled,
} from "@tabler/icons-react";
import FiltersInput from "./FiltersInput";
import { useGetLayout, useSetLayout } from "../store/layoutStore";
import todoType from "../types/todoType";
import { useDisclosure } from "@mantine/hooks";

const DisplayOptions = ({
  todos,
  sortBy,
  setSortBy,
  todoFilters,
  setTodoFilters,
  filterGroups,
  setFilterGroups,
}) => {
  // Mantine theme
  const theme = useMantineTheme();
  // Get current layout of todos
  const layout = useGetLayout();
  // Set layout of todos
  const setLayout = useSetLayout();

  const [opened, { toggle }] = useDisclosure(false);

  // Get the number of todos that have been checked off as completed
  const getNumberOfCompletedTodos = () => {
    return todos.filter((todo: todoType) => todo.isComplete).length;
  };

  // Get percentage of completed todos
  const getCompletedValue = () => {
    return (getNumberOfCompletedTodos() / todos.length) * 100;
  };

  return (
    <Stack
      p="0.5rem"
      style={{
        backgroundColor: theme.colors.dark[6],
        borderRadius: theme.radius[theme.defaultRadius],
      }}
    >
      <Stack gap="xs">
        <Text size="xs">
          Completed Todos: {getNumberOfCompletedTodos()} / {todos.length}
        </Text>
        <Collapse in={opened}>
          <Progress value={getCompletedValue()} />
        </Collapse>
      </Stack>
      <Button
        style={{ alignSelf: "flex-start" }}
        // leftSection={<IconAdjustmentsHorizontal size="14" />}
        onClick={toggle}
        size="compact-xs"
        variant="subtle"
      >
        {opened ? "Less" : "More"}
      </Button>

      <Collapse in={opened}>
        {/* Set the layout of the todos to list or grid */}
        <Stack gap="xs">
          <Text size="xs">Layout</Text>
          <SegmentedControl
            style={{ alignSelf: "flex-start" }}
            size="xs"
            value={layout}
            onChange={setLayout}
            data={[
              {
                value: "list",
                label: (
                  <>
                    <IconLayoutListFilled
                      size="20"
                      stroke="1.5"
                      style={{ display: "block" }}
                    />
                    <VisuallyHidden>List Layout</VisuallyHidden>
                  </>
                ),
              },
              {
                value: "grid",
                label: (
                  <>
                    <IconLayout2Filled
                      size="20"
                      stroke="1.5"
                      style={{ display: "block" }}
                    />
                    <VisuallyHidden>Grid Layout</VisuallyHidden>
                  </>
                ),
              },
            ]}
          />
        </Stack>
        {/* Sort todos */}
        <Stack gap="xs">
          <Text size="xs">Sort by:</Text>
          <NativeSelect
            size="xs"
            value={sortBy}
            onChange={(e) => setSortBy(e.currentTarget.value)}
            data={[
              { label: "Name", value: "name" },
              { label: "Priority", value: "priority" },
            ]}
          />
        </Stack>
      </Collapse>
      <FiltersInput
        todoFilters={todoFilters}
        setTodoFilters={setTodoFilters}
        filterGroups={filterGroups}
        setFilterGroups={setFilterGroups}
      />
    </Stack>
  );
};

export default DisplayOptions;
