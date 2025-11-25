import { Chip, CircularProgress, Stack } from "@mui/material";
import { useState } from "react";

const NewHomePage = () => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [day, setDay] = useState<
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday"
  >("Monday");
  return (
    <Stack
      gap="0.5rem"
      flex="1"
      sx={{
        overflowY: "auto",
        minHeight: "0",
        paddingY: "1rem",
        paddingX: {
          xs: "0.5rem",
          sm: "3rem",
          md: "5rem",
          lg: "10rem",
          xl: "15rem",
        },
      }}
    >
      {/* <Stack direction="row">
        <CircularProgress />
      </Stack> */}
      <Stack
        direction="row"
        gap="0.5rem"
        sx={{ overflowX: "auto", flexWrap: "nowrap" }}
      >
        {days.map((d) => (
          <Chip
            label={d}
            variant={day === d ? "filled" : "outlined"}
            onClick={() => setDay(d)}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default NewHomePage;
