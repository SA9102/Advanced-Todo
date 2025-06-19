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
import { useState } from "react";
import tagType from "../types/tagType";
import { useGetTags } from "../store/tagStore";
import todoType from "../types/todoType";

type props = {
  todoInput: todoType;
  setTodoInput: (arg: todoType) => void;
};

// Code copied from documenation, with some modifications
const TagInput = ({ todoInput, setTodoInput }: props) => {
  const allTags: tagType[] = useGetTags();

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const [tagSearch, setTagSearch] = useState("");

  const handleTagSelect = (tagName: string) => {
    // From the 'allTags' array consisting of all tag objects, extract
    // the tag object whose name is the equal to tagName. This is so we can
    // extract its id.
    const tagId = allTags.find((tag) => tag.name === tagName)!.id;
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
    const tagObj = allTags.find((tag) => tag.id === tagId);

    return (
      <Pill
        key={tagObj!.id}
        withRemoveButton
        onRemove={() => handleTagRemove(tagObj!.id)}
      >
        {tagObj!.name}
      </Pill>
    );
  });

  const options = allTags
    .filter((tag: tagType) =>
      tag.name.toLowerCase().includes(tagSearch.trim().toLowerCase())
    )
    .map((tag: tagType) => (
      <Combobox.Option
        value={tag.name}
        key={tag.name}
        active={todoInput.tags.includes(tag.name)}
      >
        <Group gap="sm">
          {todoInput.tags.includes(tag.name) ? <CheckIcon size={12} /> : null}
          <span>{tag.name}</span>
        </Group>
      </Combobox.Option>
    ));

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
