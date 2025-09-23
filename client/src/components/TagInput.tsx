import { useContext, useEffect, useState } from "react";
import tagType from "../types/tagType";
import { useGetTags } from "../store/tagStore";
import todoType from "../types/todoType";
import axios from "axios";
import { API_BASE_URL } from "../config";
import AuthContext from "../context/AuthProvider";
import {
  Chip,
  FormControl,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

type props = {
  todoInput: todoType;
  setTodoInput: (arg: todoType) => void;
};

// Code copied from documenation, with some modifications
const TagInput = ({ todoInput, setTodoInput }: props) => {
  const { auth } = useContext(AuthContext);
  const [fetchedTags, setFetchedTags] = useState([]);
  // const allTags: tagType[] = useGetTags();
  const [allTags, setAllTags] = useState([]);

  // const combobox = useCombobox({
  //   onDropdownClose: () => combobox.resetSelectedOption(),
  //   onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  // });

  const [tagSearch, setTagSearch] = useState("");

  const handleTagRemove = (tagId: string) => {
    const newTags = todoInput.tags.filter((t) => t !== tagId);

    setTodoInput({ ...todoInput, tags: newTags });
  };

  useEffect(() => {
    const handleFetchTags = async () => {
      try {
        const data = await axios.get(`${API_BASE_URL}/tag`, {
          withCredentials: true,
          headers: { Authorization: auth.accessToken },
        });
        const tags = data.data.data;
        const tagIds = tags.map((tag) => tag.tagId);
        setFetchedTags(tagIds);
        setAllTags(tags);
      } catch (err) {
        console.error(err);
      }
    };

    const handleFetchTagsLS = () => {
      let tagsLS = JSON.parse(localStorage.getItem("tags"));
      if (!tagsLS) {
        tagsLS = [];
      }

      const tagIds = tagsLS.map((tag) => tag.tagId);
      setFetchedTags(tagIds);
      setAllTags(tagsLS);
    };

    if (auth) {
      handleFetchTags();
    } else {
      handleFetchTagsLS();
    }
  }, []);

  return (
    <FormControl>
      <InputLabel id="select-tags-label">Tags</InputLabel>
      <Select
        labelId="select-tags-label"
        label="Tags"
        // size="small"
        multiple
        value={todoInput.tags}
        onChange={(e) => {
          const {
            target: { value },
          } = e;
          setTodoInput({
            ...todoInput,
            tags: typeof value === "string" ? value.split(",") : value,
          });
        }}
      >
        {allTags.map((tag) => (
          <MenuItem key={tag.tagId} value={tag.tagId}>
            {tag.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TagInput;
