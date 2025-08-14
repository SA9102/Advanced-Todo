import { create } from "zustand";

type state = {
  synced: boolean;
  actions: actions;
};

type actions = {
  setSynced: (sync: boolean) => void;
};

const useSyncStore = create<state>((set) => ({
  synced: true,
  actions: {
    setSynced: (sync: boolean) =>
      set((state) => ({
        synced: sync,
      })),
  },
}));

export const useSynced = () => useSyncStore((state) => state.synced);
export const useSetSynced = () =>
  useSyncStore((state) => state.actions.setSynced);
