import todoType from "../types/todoType";
import todoFiltersType from "../types/todoFiltersType";
import { useGetTags } from "../store/tagStore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

type props = {
  todoFilters: todoFiltersType;
  setTodoFilters: (arg: todoFiltersType) => void;
  filterGroups: string[];
  setFilterGroups: (arg: string[]) => void;
};

const FiltersInput = ({
  todoFilters,
  setTodoFilters,
  filterGroups,
  setFilterGroups,
}: props) => {
  const tags = useGetTags();

  const handleChangeFilterPriority = (val: "1" | "2" | "3") => {
    let filterPriority = todoFilters.priority;
    if (filterPriority.includes(val)) {
      filterPriority = filterPriority.filter((currVal) => currVal !== val);
    } else {
      filterPriority = [...filterPriority, val];
    }
    setTodoFilters({ ...todoFilters, priority: filterPriority });
  };

  const handleChangeFilterGroups = (
    val: "Pending" | "Completed" | "Upcoming" | "Overdue"
  ) => {
    let newFilterGroups;
    if (filterGroups.includes(val)) {
      newFilterGroups = filterGroups.filter((currVal) => currVal !== val);
    } else {
      newFilterGroups = [...filterGroups, val];
    }
    setFilterGroups(newFilterGroups);
  };

  return (
    <Stack gap="1rem">
      <TextField
        label="Task/Description"
        size="small"
        value={todoFilters.text}
        onChange={(e) =>
          setTodoFilters({ ...todoFilters, text: e.target.value })
        }
      />
      <Stack gap="xs">
        <Typography
        // size="xs"
        >
          Priority
        </Typography>
        <Stack direction="row" gap="0.5rem">
          <Chip
            label="Low"
            size="small"
            clickable
            variant={todoFilters.priority.includes("1") ? "filled" : "outlined"}
            onClick={() => {
              handleChangeFilterPriority("1");
            }}
          />
          <Chip
            label="Medium"
            size="small"
            clickable
            variant={todoFilters.priority.includes("2") ? "filled" : "outlined"}
            onClick={() => {
              handleChangeFilterPriority("2");
            }}
          />
          <Chip
            label="High"
            size="small"
            clickable
            variant={todoFilters.priority.includes("3") ? "filled" : "outlined"}
            onClick={() => {
              handleChangeFilterPriority("3");
            }}
          />
        </Stack>
      </Stack>
      <Select
        multiple
        value={todoFilters.tags}
        onChange={(e) => {
          const {
            target: { value },
          } = e;
          setTodoFilters({
            ...todoFilters,
            tags: typeof value === "string" ? value.split(",") : value,
          });
        }}
        // renderValue={(selected) => (
        //   <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        //     {selected.map((value) => (
        //       <Chip key={value.tagId} label={value.label} />
        //     ))}
        //   </Box>
        // )}
      >
        {tags.map((tag) => (
          <MenuItem key={tag.tagId} value={tag.tagId}>
            {tag.label}
          </MenuItem>
        ))}
      </Select>
      <Stack gap="xs">
        <Typography
        // size="xs"
        >
          Groups
        </Typography>
        <Stack direction="row" gap="0.5rem">
          <Chip
            label="Pending"
            size="small"
            clickable
            variant={filterGroups.includes("Pending") ? "filled" : "outlined"}
            onClick={() => {
              handleChangeFilterGroups("Pending");
            }}
          />
          <Chip
            label="Completed"
            size="small"
            clickable
            variant={filterGroups.includes("Completed") ? "filled" : "outlined"}
            onClick={() => {
              handleChangeFilterGroups("Completed");
            }}
          />
          <Chip
            label="Upcoming"
            size="small"
            clickable
            variant={filterGroups.includes("Upcoming") ? "filled" : "outlined"}
            onClick={() => {
              handleChangeFilterGroups("Upcoming");
            }}
          />
          <Chip
            label="Overdue"
            size="small"
            clickable
            variant={filterGroups.includes("Overdue") ? "filled" : "outlined"}
            onClick={() => {
              handleChangeFilterGroups("Overdue");
            }}
          />
        </Stack>
      </Stack>
      <Divider />
    </Stack>
    // <Accordion style={{ flex: 1 }}>
    //   <AccordionSummary>
    //     <Typography>Filters</Typography>
    //   </AccordionSummary>
    //   <AccordionDetails>
    //     <Stack gap="1rem">
    //       <TextField
    //         label="Task/Description"
    //         size="small"
    //         value={todoFilters.text}
    //         onChange={(e) =>
    //           setTodoFilters({ ...todoFilters, text: e.target.value })
    //         }
    //       />
    //       <Stack gap="xs">
    //         <Typography
    //         // size="xs"
    //         >
    //           Priority
    //         </Typography>
    //         <Stack direction="row">
    //           <Chip
    //             label="Low"
    //             size="small"
    //             clickable
    //             variant={
    //               todoFilters.priority.includes("1") ? "filled" : "outlined"
    //             }
    //             onClick={() => {
    //               handleChangeFilterPriority("1");
    //             }}
    //           />
    //           <Chip
    //             label="Medium"
    //             size="small"
    //             clickable
    //             variant={
    //               todoFilters.priority.includes("2") ? "filled" : "outlined"
    //             }
    //             onClick={() => {
    //               handleChangeFilterPriority("2");
    //             }}
    //           />
    //           <Chip
    //             label="High"
    //             size="small"
    //             clickable
    //             variant={
    //               todoFilters.priority.includes("3") ? "filled" : "outlined"
    //             }
    //             onClick={() => {
    //               handleChangeFilterPriority("3");
    //             }}
    //           />
    //         </Stack>
    //       </Stack>
    //       <Select
    //         multiple
    //         value={todoFilters.tags}
    //         onChange={(e) => {
    //           const {
    //             target: { value },
    //           } = e;
    //           setTodoFilters({
    //             ...todoFilters,
    //             tags: typeof value === "string" ? value.split(",") : value,
    //           });
    //         }}
    //         // renderValue={(selected) => (
    //         //   <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
    //         //     {selected.map((value) => (
    //         //       <Chip key={value.tagId} label={value.label} />
    //         //     ))}
    //         //   </Box>
    //         // )}
    //       >
    //         {tags.map((tag) => (
    //           <MenuItem key={tag.tagId} value={tag.tagId}>
    //             {tag.label}
    //           </MenuItem>
    //         ))}
    //       </Select>
    //       <Stack gap="xs">
    //         <Typography
    //         // size="xs"
    //         >
    //           Groups
    //         </Typography>
    //         <Stack direction="row">
    //           <Chip
    //             label="Pending"
    //             size="small"
    //             clickable
    //             variant={
    //               filterGroups.includes("Pending") ? "filled" : "outlined"
    //             }
    //             onClick={() => {
    //               handleChangeFilterGroups("Pending");
    //             }}
    //           />
    //           <Chip
    //             label="Completed"
    //             size="small"
    //             clickable
    //             variant={
    //               filterGroups.includes("Completed") ? "filled" : "outlined"
    //             }
    //             onClick={() => {
    //               handleChangeFilterGroups("Completed");
    //             }}
    //           />
    //           <Chip
    //             label="Upcoming"
    //             size="small"
    //             clickable
    //             variant={
    //               filterGroups.includes("Upcoming") ? "filled" : "outlined"
    //             }
    //             onClick={() => {
    //               handleChangeFilterGroups("Upcoming");
    //             }}
    //           />
    //           <Chip
    //             label="Overdue"
    //             size="small"
    //             clickable
    //             variant={
    //               filterGroups.includes("Overdue") ? "filled" : "outlined"
    //             }
    //             onClick={() => {
    //               handleChangeFilterGroups("Overdue");
    //             }}
    //           />
    //         </Stack>
    //       </Stack>
    //     </Stack>
    //   </AccordionDetails>
    // </Accordion>
  );
};

export default FiltersInput;
