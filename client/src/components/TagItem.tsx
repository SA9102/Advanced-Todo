import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { MuiColorInput } from "mui-color-input";
import AuthContext from "../context/AuthProvider";
import tagType from "../types/tagType";
import { useTagActions } from "../store/tagStore";
import { useGetTodos, useTodoActions } from "../store/todoStore";
import todoType from "../types/todoType";
import axios from "axios";
import { API_BASE_URL } from "../config";

const TagItem = ({ tag }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [tagInput, setTagInput] = useState(tag);
  const { auth } = useContext(AuthContext);
  const { updateTag, deleteTag } = useTagActions();

  const todos = useGetTodos();
  const { setTodos } = useTodoActions();

  const handleSaveToDB = () => {};

  const handleSaveToLS = () => {
    let tagsLS = JSON.parse(localStorage.getItem("tags"));

    tagsLS = tagsLS.map((tagLS: tagType) => {
      if (tagLS.tagId === tag.tagId) {
        return tagInput;
      }
      return tagLS;
    });

    localStorage.setItem("tags", JSON.stringify(tagsLS));
  };

  const handleDeleteFromLS = () => {
    // Before removing the tag, we need to remove the links that the tag
    // may have with some todos

    let todosLS = JSON.parse(localStorage.getItem("todos"));

    if (todosLS) {
      todosLS = todosLS.map((todoLS: todoType) => {
        const newTags = todoLS.tags.filter((tagId: string) => {
          if (tagId !== tag.tagId) {
            return tagId;
          }
        });
        return { ...todoLS, tags: newTags };
      });
      localStorage.setItem("todos", JSON.stringify(todosLS));
      setTodos(todosLS);
    }

    let tagsLS = JSON.parse(localStorage.getItem("tags"));
    if (tagsLS) {
      tagsLS = tagsLS.filter((tagLS: tagType) => tagLS.tagId !== tag.tagId);
      localStorage.setItem("tags", JSON.stringify(tagsLS));
    }
  };

  const handleDeleteDB = async () => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/tag`, {
        data: { tagId: tag.tagId },
        withCredentials: true,
        headers: { Authorization: auth.accessToken },
      });
      const newTodos = todos.map((todo: todoType) => {
        const newTags = todo.tags.filter(
          (tagId: string) => tagId !== tag.tagId
        );
        return { ...todo, tags: newTags };
      });
      try {
        await axios.put(
          `${API_BASE_URL}/todo`,
          { _id: auth._id, username: auth.username, data: newTodos },
          {
            withCredentials: true,
            headers: { Authorization: auth.accessToken },
          }
        );
        setTodos(newTodos);
      } catch (e) {
        console.error(e);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Stack>
        <Card
          key={tag.tagId}
          sx={{
            padding: "0.5rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" alignItems="center" gap="1rem">
            <div
              style={{
                aspectRatio: 1 / 1,
                height: "100%",
                backgroundColor: tag.colour,
                borderRadius: "0.5rem",
              }}
            ></div>
            <Typography>{tag.label}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center">
            <IconButton onClick={() => setOpenDialog(true)}>
              <EditIcon />
            </IconButton>
            <IconButton>
              <DeleteIcon
                onClick={() => {
                  deleteTag(tag.tagId);
                  if (auth) {
                    handleDeleteDB();
                  } else {
                    handleDeleteFromLS();
                  }
                }}
              />
            </IconButton>
          </Stack>
        </Card>
      </Stack>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Tag</DialogTitle>
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
              setOpenDialog(false);
              setTagInput(tag);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              updateTag(tagInput);
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

export default TagItem;
