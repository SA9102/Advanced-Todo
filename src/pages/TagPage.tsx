import { Button, ColorPicker, Group, TextInput } from "@mantine/core";
import { useState } from "react";
import tagType from "../types/tagType";
import { Link } from "react-router";
import { HOME } from "../routes/routes";
import { useTagActions } from "../store/tagStore";
import emptyTag from "../utils/emptyTag";

const TagPage = () => {
  const { createTag } = useTagActions();
  const [tagInput, setTagInput] = useState<tagType>(emptyTag);
  return (
    <>
      <TextInput
        label="Name"
        size="xs"
        value={tagInput.name}
        onChange={(e) => setTagInput({ ...tagInput, name: e.target.value })}
      />
      <ColorPicker
        format="hex"
        value={tagInput.colour}
        onChange={(newColour) =>
          setTagInput({ ...tagInput, colour: newColour })
        }
      />
      <Group>
        <Button size="xs" flex="1" variant="outline" component={Link} to={HOME}>
          Cancel
        </Button>
        <Button
          size="xs"
          flex="1"
          component={Link}
          to={HOME}
          onClick={() => createTag(tagInput)}
        >
          Save
        </Button>
      </Group>
    </>
  );
};

export default TagPage;
