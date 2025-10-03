import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthProvider";
import tagType from "../types/tagType";
import emptyTag from "../utils/emptyTag";
import { MuiColorInput } from "mui-color-input";
import { useGetTags, useTagActions } from "../store/tagStore";
import TagItem from "../components/TagItem";

const TagsPage = () => {
  // const [tags, setTags] = useState<tagType[]>([]);
  const tags: tagType[] = useGetTags();
  console.log("TAGS");
  console.log(tags);
  const { auth } = useContext(AuthContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [tagInput, setTagInput] = useState<tagType>(emptyTag);

  const { setTags, createTag } = useTagActions();

  const handleFetchTagsDB = () => {};

  const handleFetchTagsLS = () => {
    const tagsLS = JSON.parse(localStorage.getItem("tags"));

    if (tagsLS) {
      setTags(tagsLS);
    } else {
      setTags([]);
    }
  };

  const handleSaveToDB = () => {};

  const handleSaveToLS = () => {
    let tagsLS = JSON.parse(localStorage.getItem("tags"));
    if (!tagsLS) {
      tagsLS = [tagInput];
    } else {
      tagsLS = [...tagsLS, tagInput];
    }
    localStorage.setItem("tags", JSON.stringify(tagsLS));
  };

  useEffect(() => {
    if (auth) {
      handleFetchTagsDB();
    } else {
      handleFetchTagsLS();
    }
  }, [auth, createTag]);

  return (
    <>
      <Stack
        gap="0.5rem"
        p="0.5rem"
        flex="1"
        sx={{ overflowY: "auto", minHeight: "0" }}
      >
        <Button
          sx={{ alignSelf: "flex-start" }}
          variant="outlined"
          onClick={() => setOpenDialog(true)}
        >
          New Tag
        </Button>
        <Stack flex="1" sx={{ minHeight: "0", overflowY: "auto" }} gap="0.5rem">
          {tags.map((tag: tagType) => (
            <TagItem key={tag.tagId} tag={tag} />
          ))}
        </Stack>
      </Stack>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>New Tag</DialogTitle>
        <DialogContent>
          <Stack>
            <TextField
              label="Label"
              value={tagInput.label}
              onChange={(e) =>
                setTagInput({ ...tagInput, label: e.target.value })
              }
            />
            <MuiColorInput
              format="hex"
              value={tagInput.colour}
              onChange={(newColour) =>
                setTagInput({ ...tagInput, colour: newColour })
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              createTag(tagInput);
              if (auth) {
                handleSaveToDB();
              } else {
                handleSaveToLS();
              }
              setOpenDialog(false);
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TagsPage;
