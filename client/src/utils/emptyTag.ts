import tagType from "../types/tagType";
import { v4 as uuidv4 } from "uuid";

const emptyTag: tagType = {
  tagId: uuidv4(),
  label: "",
  colour: "#ffffff",
  userId: "686bb991665e3d6bb3ad2044",
};

export default emptyTag;
