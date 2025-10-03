import FiltersInput from "./FiltersInput";
import { useGetLayout, useSetLayout } from "../store/layoutStore";
import todoType from "../types/todoType";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import { useState } from "react";
import SortIcon from "@mui/icons-material/Sort";

const DisplayOptions = ({
  todos,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  todoFilters,
  setTodoFilters,
  filterGroups,
  setFilterGroups,
}) => {
  // Get current layout of todos
  const layout = useGetLayout();
  // Set layout of todos
  const setLayout = useSetLayout();

  const [filtersOpen, setFiltersOpen] = useState(false);

  const [sortByAnchor, setSortByAnchor] = useState(null);
  const sortByOpen = Boolean(sortByAnchor);

  const [sortOrderAnchor, setSortOrderAnchor] = useState(null);
  const sortOrderOpen = Boolean(sortOrderAnchor);

  // Get the number of todos that have been checked off as completed
  const getNumberOfCompletedTodos = () => {
    return todos.filter((todo: todoType) => todo.isComplete).length;
  };

  // Get percentage of completed todos
  const getCompletedValue = () => {
    return (getNumberOfCompletedTodos() / todos.length) * 100;
  };

  return (
    <Stack
    // p="0.5rem"
    // style={{
    //   backgroundColor: theme.colors.dark[6],
    //   borderRadius: theme.radius[theme.defaultRadius],
    // }}
    >
      {/* <Accordion style={{ flex: 1 }}>
          <AccordionSummary>
            <Typography>More</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack>
              <Stack>
                <FormControl>
                  <InputLabel id="sort-by-label">Sort by</InputLabel>
                  <Select
                    size="small"
                    labelId="sort-by-label"
                    value={sortBy}
                    label="Sort by"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="priority">Priority</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          </AccordionDetails>
        </Accordion> */}
      {/* <Collapse in={opened}>
        <Stack gap="xs">
          <Text size="xs">Layout</Text>
          <SegmentedControl
            style={{ alignSelf: "flex-start" }}
            size="xs"
            value={layout}
            onChange={setLayout}
            data={[
              {
                value: "list",
                label: (
                  <>
                    <IconLayoutListFilled
                      size="20"
                      stroke="1.5"
                      style={{ display: "block" }}
                    />
                    <VisuallyHidden>List Layout</VisuallyHidden>
                  </>
                ),
              },
              {
                value: "grid",
                label: (
                  <>
                    <IconLayout2Filled
                      size="20"
                      stroke="1.5"
                      style={{ display: "block" }}
                    />
                    <VisuallyHidden>Grid Layout</VisuallyHidden>
                  </>
                ),
              },
            ]}
          />
        </Stack>
        <Stack gap="xs">
          <Text size="xs">Sort by:</Text>
          <NativeSelect
            size="xs"
            value={sortBy}
            onChange={(e) => setSortBy(e.currentTarget.value)}
            data={[
              { label: "Name", value: "name" },
              { label: "Priority", value: "priority" },
            ]}
          />
        </Stack>
      </Collapse> */}
      {/* <Stack direction="row" gap="1rem"> */}
      <FormGroup>
        <Stack direction="row" alignItems="center">
          <Typography>Filters</Typography>
          <Switch
            checked={filtersOpen}
            onChange={(e) => setFiltersOpen(e.target.checked)}
          />
        </Stack>
      </FormGroup>
      {filtersOpen && (
        <FiltersInput
          todoFilters={todoFilters}
          setTodoFilters={setTodoFilters}
          filterGroups={filterGroups}
          setFilterGroups={setFilterGroups}
        />
      )}
      <Stack direction="row" gap="1rem">
        <Card
          sx={{ padding: "0.3rem 0.7rem", flex: "1" }}
          onClick={(e) => setSortByAnchor(e.currentTarget)}
        >
          <Typography>Sort by: {sortBy}</Typography>
        </Card>
        <Card
          sx={{ padding: "0.3rem 0.7rem", flex: "1" }}
          onClick={(e) => setSortOrderAnchor(e.currentTarget)}
        >
          <Typography>Sort order: {sortOrder}</Typography>
        </Card>
      </Stack>
      {/* <Button
          size="small"
          variant={sortByOpen ? "contained" : "outlined"}
          // style={{ alignSelf: "flex-start" }}
          onClick={() => setSortByOpen(!sortByOpen)}
        >
          <SortIcon fontSize="small" />
        </Button>
        <Button
          size="small"
          variant={filtersOpen ? "contained" : "outlined"}
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <FilterAltIcon fontSize="small" />
        </Button> */}
      {/* </Stack> */}
      {/* {sortByOpen && (
        <Stack>
          <FormControl>
            <InputLabel id="sort-by-label">Sort by</InputLabel>
            <Select
              size="small"
              labelId="sort-by-label"
              value={sortBy}
              label="Sort by"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      )} */}

      <Menu
        anchorEl={sortByAnchor}
        onClose={() => setSortByAnchor(null)}
        open={sortByOpen}
      >
        <MenuItem>
          <ListItemText>Date Created</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText
            onClick={() => {
              setSortBy("name");
              setSortByAnchor(null);
            }}
          >
            Name
          </ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText
            onClick={() => {
              setSortBy("priority");
              setSortByAnchor(null);
            }}
          >
            Priority
          </ListItemText>
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={sortOrderAnchor}
        onClose={() => setSortOrderAnchor(null)}
        open={sortOrderOpen}
      >
        <MenuItem>
          <ListItemText
            onClick={() => {
              setSortOrder("ascending");
              setSortOrderAnchor(null);
            }}
          >
            Ascending
          </ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText
            onClick={() => {
              setSortOrder("descending");
              setSortOrderAnchor(null);
            }}
          >
            Descending
          </ListItemText>
        </MenuItem>
      </Menu>
    </Stack>
  );
};

export default DisplayOptions;
