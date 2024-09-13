import { create } from 'zustand'

export const usePostStore = create((set) => ({
  feedType: 'forYou',
  setFeedType: (feedType) => set({ feedType }),
  comment: '',
  setComment: (comment) => set({ comment }),
}))
