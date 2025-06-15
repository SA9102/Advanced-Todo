import tagType from "../types/tagType";
import { v4 as uuidv4 } from "uuid";

const emptyTag: tagType = {
  id: uuidv4(),
  name: "",
  colour: "#ffffff",
};

export default emptyTag;
