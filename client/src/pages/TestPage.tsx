import { Text } from "@mantine/core";
import { useEffect } from "react";
import axios from "axios";

const TestPage = () => {
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get("http://localhost:3000/test", {
          withCredentials: true,
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetch();
  }, []);

  return (
    <>
      <Text>TEST PAGE</Text>
    </>
  );
};

export default TestPage;
