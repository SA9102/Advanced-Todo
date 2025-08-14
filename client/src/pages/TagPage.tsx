import { Button, ColorPicker, Group, TextInput } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import tagType from "../types/tagType";
import { Link } from "react-router";
import { HOME } from "../routes/routes";
import { useTagActions } from "../store/tagStore";
import emptyTag from "../utils/emptyTag";
import axios from "axios";
import { API_BASE_URL } from "../config";
import AuthContext from "../context/AuthProvider";

const TagPage = () => {
  const { createTag } = useTagActions();
  const [tagInput, setTagInput] = useState<tagType>(emptyTag);
  const { auth } = useContext(AuthContext);
  const handleSaveToDB = async () => {
    try {
      console.log("TRYING...");
      await axios.post(
        `${API_BASE_URL}/tag`,
        {
          // _id: auth._id,
          // username: auth.username,
          data: {
            tagId: tagInput?.tagId,
            label: tagInput?.label,
            colour: tagInput?.colour,
            userId: auth._id,
          },
        },
        {
          withCredentials: true,
          headers: { Authorization: auth.accessToken },
        }
      );
      console.log("SUCCESS");
    } catch (err) {
      console.log("THERE WAS AN ERROR");
      console.error(err);
    }
  };
  console.log(tagInput);

  return (
    <>
      <TextInput
        label="Name"
        size="xs"
        value={tagInput.label}
        onChange={(e) => setTagInput({ ...tagInput, label: e.target.value })}
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
          onClick={() => {
            createTag(tagInput);
            handleSaveToDB();
          }}
        >
          Save
        </Button>
      </Group>
    </>
  );
};

export default TagPage;
