import { create } from 'zustand'

export type DashboardTab =
  | 'overview'
  | 'active-cases'
  | 'reports'
  | 'settlement'
  | 'litigation'
  | 'prospects'
  | 'history'

type DashboardState = {
  activeTab: DashboardTab
  setActiveTab: (tab: DashboardTab) => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeTab: 'overview',
  setActiveTab: (tab) => set({ activeTab: tab }),
}))

