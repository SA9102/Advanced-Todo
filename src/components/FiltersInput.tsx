import {
  Button,
  Chip,
  Collapse,
  Group,
  MultiSelect,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAdjustmentsHorizontal,
  IconFilterFilled,
} from "@tabler/icons-react";
import todoType from "../types/todoType";
import todoFiltersType from "../types/todoFiltersType";
import { useGetTags } from "../store/tagStore";

type props = {
  todoFilters: todoFiltersType;
  setTodoFilters: (arg: todoFiltersType) => void;
};

const FiltersInput = ({ todoFilters, setTodoFilters }: props) => {
  const [opened, { toggle }] = useDisclosure(false);

  const tags = useGetTags();

  return (
    <Stack>
      <Button
        style={{ alignSelf: "flex-start" }}
        leftSection={<IconAdjustmentsHorizontal size="14" />}
        onClick={toggle}
        size="xs"
        variant="light"
      >
        {opened ? "Close" : "Open"} Filters
      </Button>
      <Collapse in={opened} bg="dark.8" p="xs">
        <Stack gap="xs">
          <TextInput
            label="Task/Description"
            size="xs"
            value={todoFilters.text}
            onChange={(e) =>
              setTodoFilters({ ...todoFilters, text: e.target.value })
            }
          />
          <Stack gap="xs">
            <Text size="xs">Priority</Text>
            <Chip.Group
              multiple
              value={todoFilters.priority}
              onChange={(newPri) =>
                setTodoFilters({ ...todoFilters, priority: newPri })
              }
            >
              <Group>
                <Chip value="1" size="xs">
                  Low
                </Chip>

                <Chip value="2" size="xs">
                  Medium
                </Chip>
                <Chip value="3" size="xs">
                  High
                </Chip>
              </Group>
            </Chip.Group>
          </Stack>
          <MultiSelect
            label="Tags"
            size="sm"
            data={tags.map((tag) => tag.name)}
            value={todoFilters.tags}
            onChange={(newTags) =>
              setTodoFilters({ ...todoFilters, tags: newTags })
            }
          />
        </Stack>
      </Collapse>
    </Stack>
  );
};

export default FiltersInput;
