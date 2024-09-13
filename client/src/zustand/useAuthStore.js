import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  isLogin: false,
  setIsLogin: (loginState) => set({ isLogin: loginState }),
}))
