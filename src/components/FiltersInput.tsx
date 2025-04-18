import { Button, Collapse, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const FiltersInput = () => {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Stack>
      <Button onClick={toggle}>Open filter</Button>
      <Collapse in={opened}>
        <Text>Filters</Text>
      </Collapse>
    </Stack>
  );
};

export default FiltersInput;
