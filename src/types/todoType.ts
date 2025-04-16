type todoType = {
  id: string;
  task: string;
  description: string;
  isComplete: boolean;
  isChangingTask: boolean;
  priority: "1" | "2" | "3"; // 1 is lowest, 3 is highest
};

export default todoType;
