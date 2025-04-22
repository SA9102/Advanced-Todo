import tagType from "./tagType";

type todoType = {
  id: string;
  task: string;
  description: string;
  priority: "1" | "2" | "3"; // 1 is lowest, 3 is highest
  tags: string[];
  start: Date | null;
  end: Date | null;
  isComplete: boolean;
  isChangingTask: boolean;
  isExpanded: boolean;
};

export default todoType;
