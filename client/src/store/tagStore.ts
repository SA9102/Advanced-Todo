import { create } from "zustand";
import tagType from "../types/tagType";
import mockTags from "../utils/mockTags";

type state = {
  tags: tagType[];
  actions: actions;
};

type actions = {
  setTags: (tags: tagType[]) => void;
  createTag: (newTag: tagType) => void;
  updateTag: (updatedTag: tagType) => void;
  deleteTag: (tagId: string) => void;
};

const useTagStore = create<state>((set) => ({
  tags: [],
  actions: {
    setTags: (tags: tagType[]) => set((state) => ({ tags })),
    createTag: (newTag: tagType) =>
      set((state) => ({
        tags: [...state.tags, newTag],
      })),
    updateTag: (updatedTag: tagType) =>
      set((state) => ({
        tags: state.tags.map((tag: tagType) => {
          if (tag.tagId === updatedTag.tagId) {
            return updatedTag;
          }
          return tag;
        }),
      })),
    deleteTag: (tagId: string) =>
      set((state) => ({
        tags: state.tags.filter((tag: tagType) => tag.tagId !== tagId),
      })),
  },
}));

export const useGetTags = () => useTagStore((state) => state.tags);
export const useGetTag = (id: string) =>
  useTagStore((state) => state.tags.find((tag) => tag.tagId === id));
export const useTagActions = () => useTagStore((state) => state.actions);
