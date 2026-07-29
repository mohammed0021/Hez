import { create } from 'zustand';
import type { Notification } from '@/types';

interface UiState {
  isHeaderVisible: boolean;
  isPullToRefresh: boolean;
  activeTab: string;
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  notificationOpen: boolean;
  userMenuOpen: boolean;
  setActiveTab: (tab: string) => void;
  setHeaderVisible: (visible: boolean) => void;
  setPullToRefresh: (refreshing: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setNotificationOpen: (open: boolean) => void;
  setUserMenuOpen: (open: boolean) => void;
  closeAll: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
  isHeaderVisible: true,
  isPullToRefresh: false,
  activeTab: 'home',
  sidebarOpen: false,
  commandPaletteOpen: false,
  notificationOpen: false,
  userMenuOpen: false,
  setActiveTab: (activeTab) => set({ activeTab }),
  setHeaderVisible: (isHeaderVisible) => set({ isHeaderVisible }),
  setPullToRefresh: (isPullToRefresh) => set({ isPullToRefresh }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
  setNotificationOpen: (notificationOpen) => set({ notificationOpen }),
  setUserMenuOpen: (userMenuOpen) => set({ userMenuOpen }),
  closeAll: () =>
    set({
      sidebarOpen: false,
      commandPaletteOpen: false,
      notificationOpen: false,
      userMenuOpen: false,
    }),
}));

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Notification) => void;
}

export const useInAppNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) =>
    set({ notifications, unreadCount: notifications.filter((n) => !n.read).length }),
  markAsRead: (id) =>
    set((s) => {
      const notifications = s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      return { notifications, unreadCount: notifications.filter((n) => !n.read).length };
    }),
  markAllAsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  addNotification: (notification) =>
    set((s) => ({
      notifications: [notification, ...s.notifications],
      unreadCount: s.unreadCount + 1,
    })),
}));
