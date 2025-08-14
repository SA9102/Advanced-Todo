type todoFiltersType = {
  text: string;
  priority: string[];
  tags: string[];
  start: Date | null;
  end: Date | null;
};

export default todoFiltersType;
