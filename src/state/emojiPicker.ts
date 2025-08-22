import { create } from 'zustand';

interface EmojiPickerState {
  showEmojiPicker: boolean;
  currentPostId: string | null;
  selectedEmoji: string | null;
  setShowEmojiPicker: (show: boolean) => void;
  setCurrentPostId: (postId: string | null) => void;
  openEmojiPicker: (postId: string) => void;
  closeEmojiPicker: () => void;
  addEmojiToPost: (emoji: string) => void;
}

export const useEmojiPicker = create<EmojiPickerState>((set, get) => ({
  showEmojiPicker: false,
  currentPostId: null,
  selectedEmoji: null,
  setShowEmojiPicker: (show) => set({ showEmojiPicker: show }),
  setCurrentPostId: (postId) => set({ currentPostId: postId }),
  openEmojiPicker: (postId) => set({ showEmojiPicker: true, currentPostId: postId }),
  closeEmojiPicker: () => set({ showEmojiPicker: false, currentPostId: null, selectedEmoji: null }),
  addEmojiToPost: (emoji: string) => {
    const { currentPostId } = get();
    if (currentPostId) {
      // Set the selected emoji and close the picker
      // PostCard will listen for this and apply the reaction
      set({ selectedEmoji: emoji, showEmojiPicker: false });
    }
  },
}));
