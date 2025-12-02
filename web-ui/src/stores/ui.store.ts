import { create } from 'zustand'

type UIState = { sidebarCollapsed: boolean; setCollapsed: (v: boolean) => void }
export const useUIStore = create<UIState>((set) => ({ sidebarCollapsed: false, setCollapsed: (v) => set({ sidebarCollapsed: v }) }))

