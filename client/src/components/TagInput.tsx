import {
  CheckIcon,
  Combobox,
  Group,
  Pill,
  PillsInput,
  Stack,
  Text,
  useCombobox,
} from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import tagType from "../types/tagType";
import { useGetTags } from "../store/tagStore";
import todoType from "../types/todoType";
import axios from "axios";
import { API_BASE_URL } from "../config";
import AuthContext from "../context/AuthProvider";

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

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const [tagSearch, setTagSearch] = useState("");

  const handleTagSelect = (tagName: string) => {
    // From the 'allTags' array consisting of all tag objects, extract
    // the tag object whose name is the equal to tagName. This is so we can
    // extract its id.
    const tagId = allTags.find((tag) => tag.label === tagName)!.tagId;
    let newTags;
    if (todoInput.tags.includes(tagId)) {
      newTags = todoInput.tags.filter((tag) => tag !== tagId);
    } else {
      newTags = [...todoInput.tags, tagId];
    }
    setTodoInput({ ...todoInput, tags: newTags });
  };

  const handleTagRemove = (tagId: string) => {
    const newTags = todoInput.tags.filter((t) => t !== tagId);

    setTodoInput({ ...todoInput, tags: newTags });
  };

  const values = todoInput.tags.map((tagId) => {
    let tagObj = allTags.find((tag) => tag.tagId === tagId);
    if (!tagObj) {
      tagObj = [];
    }
    return (
      <Pill
        key={tagObj!.tagId}
        withRemoveButton
        onRemove={() => handleTagRemove(tagObj!.tagId)}
      >
        {tagObj!.label}
      </Pill>
    );
  });

  const options = allTags
    .filter((tag: tagType) =>
      tag.label.toLowerCase().includes(tagSearch.trim().toLowerCase())
    )
    .map((tag: tagType) => (
      <Combobox.Option
        value={tag.label}
        key={tag.label}
        active={todoInput.tags.includes(tag.label)}
      >
        <Group gap="sm">
          {todoInput.tags.includes(tag.label) ? <CheckIcon size={12} /> : null}
          <span>{tag.label}</span>
        </Group>
      </Combobox.Option>
    ));

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
    <Stack gap="xs">
      <Text size="sm">Tags</Text>
      <Combobox store={combobox} onOptionSubmit={handleTagSelect}>
        <Combobox.DropdownTarget>
          <PillsInput onClick={() => combobox.openDropdown()}>
            <Pill.Group>
              {values}

              <Combobox.EventsTarget>
                <PillsInput.Field
                  onFocus={() => combobox.openDropdown()}
                  onBlur={() => combobox.closeDropdown()}
                  value={tagSearch}
                  onChange={(event) => {
                    combobox.updateSelectedOptionIndex();
                    setTagSearch(event.currentTarget.value);
                  }}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Backspace" &&
                      tagSearch.length === 0 &&
                      todoInput.tags.length > 0
                    ) {
                      event.preventDefault();
                      handleTagRemove(
                        todoInput.tags[todoInput.tags.length - 1]
                      );
                    }
                  }}
                />
              </Combobox.EventsTarget>
            </Pill.Group>
          </PillsInput>
        </Combobox.DropdownTarget>

        <Combobox.Dropdown>
          <Combobox.Options>
            {options.length > 0 ? (
              options
            ) : (
              <Combobox.Empty>No tags found</Combobox.Empty>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </Stack>
  );
};

export default TagInput;
