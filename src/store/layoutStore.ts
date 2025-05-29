import { create } from "zustand";

type state = {
  layout: "list" | "grid";
  actions: actions;
};

type actions = {
  setLayout: (layout: "list" | "grid") => void;
};

const useLayoutStore = create<state>((set) => ({
  layout: "list",
  actions: {
    setLayout: (newLayout: "list" | "grid") =>
      set((state) => ({
        layout: newLayout,
      })),
  },
}));

export const useGetLayout = () => useLayoutStore((state) => state.layout);
export const useSetLayout = () =>
  useLayoutStore((state) => state.actions.setLayout);
