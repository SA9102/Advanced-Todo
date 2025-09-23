import { useContext, useEffect, useState } from "react";
import tagType from "../types/tagType";
import { Link } from "react-router";
import { HOME } from "../routes/routes";
import { useTagActions } from "../store/tagStore";
import emptyTag from "../utils/emptyTag";
import axios from "axios";
import { API_BASE_URL } from "../config";
import AuthContext from "../context/AuthProvider";
import { Button, Stack, TextField } from "@mui/material";

const TagPage = () => {
  const { createTag } = useTagActions();
  const [tagInput, setTagInput] = useState<tagType>(emptyTag);
  const { auth } = useContext(AuthContext);
  const handleSaveToDB = async () => {
    try {
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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <TextField
        label="Name"
        // size="xs"
        value={tagInput.label}
        onChange={(e) => setTagInput({ ...tagInput, label: e.target.value })}
      />
      {/* <ColorPicker
        format="hex"
        value={tagInput.colour}
        onChange={(newColour) =>
          setTagInput({ ...tagInput, colour: newColour })
        }
      /> */}
      <Stack direction="row">
        <Button
          // size="xs" flex="1" variant="outline"
          component={Link}
          to={HOME}
        >
          Cancel
        </Button>
        <Button
          // size="xs"
          // flex="1"
          component={Link}
          to={HOME}
          onClick={() => {
            createTag(tagInput);
            handleSaveToDB();
          }}
        >
          Save
        </Button>
      </Stack>
    </>
  );
};

export default TagPage;
