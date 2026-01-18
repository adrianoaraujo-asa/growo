import { create } from "zustand";
import { persist } from "zustand/middleware";

export type EditorMode = "rich" | "markdown";

interface EditorPreferenceState {
  editorMode: EditorMode;
  setEditorMode: (mode: EditorMode) => void;
  toggleMode: () => void;
}

export const useEditorPreference = create<EditorPreferenceState>()(
  persist(
    (set, get) => ({
      editorMode: "rich",
      setEditorMode: (mode) => set({ editorMode: mode }),
      toggleMode: () =>
        set({ editorMode: get().editorMode === "rich" ? "markdown" : "rich" }),
    }),
    {
      name: "editor-mode-preference",
    }
  )
);
