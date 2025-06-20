import { Button, ColorPicker, Group, TextInput } from "@mantine/core";
import { useGetTag, useTagActions } from "../store/tagStore";
import { useState } from "react";
import emptyTag from "../utils/emptyTag";
import { Link, useParams } from "react-router";
import { EDIT_TAGS, HOME } from "../routes/routes";
import tagType from "../types/tagType";

const EditTagPage = () => {
  const tagId = useParams().id;
  const { updateTag } = useTagActions();

  const [tagInput, setTagInput] = useState(useGetTag(tagId!));
  return (
    <>
      <TextInput
        label="Name"
        size="xs"
        value={tagInput!.name}
        onChange={(e) => setTagInput({ ...tagInput!, name: e.target.value })}
      />
      <ColorPicker
        format="hex"
        value={tagInput!.colour}
        onChange={(newColour) =>
          setTagInput({ ...tagInput!, colour: newColour })
        }
      />
      <Group>
        <Button
          size="xs"
          flex="1"
          variant="outline"
          component={Link}
          to={EDIT_TAGS}
        >
          Cancel
        </Button>
        <Button
          size="xs"
          flex="1"
          component={Link}
          to={EDIT_TAGS}
          onClick={() => updateTag(tagInput!)}
        >
          Save
        </Button>
      </Group>
    </>
  );
};

export default EditTagPage;
