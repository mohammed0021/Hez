import { create } from 'zustand';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top' | 'bottom';

export interface Toast {
  id: string;
  message: string;
  description?: string;
  variant: ToastVariant;
  position: ToastPosition;
  duration: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  success: (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'variant'>>) => string;
  error: (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'variant'>>) => string;
  warning: (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'variant'>>) => string;
  info: (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'variant'>>) => string;
}

const generateId = () => `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],

  addToast: (toast) => {
    const id = generateId();
    const newToast: Toast = { ...toast, id };
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    if (toast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, toast.duration);
    }

    return id;
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  success: (message, options) =>
    get().addToast({
      message,
      variant: 'success',
      position: 'bottom',
      duration: 3000,
      ...options,
    }),

  error: (message, options) =>
    get().addToast({
      message,
      variant: 'error',
      position: 'bottom',
      duration: 4000,
      ...options,
    }),

  warning: (message, options) =>
    get().addToast({
      message,
      variant: 'warning',
      position: 'bottom',
      duration: 3000,
      ...options,
    }),

  info: (message, options) =>
    get().addToast({
      message,
      variant: 'info',
      position: 'bottom',
      duration: 3000,
      ...options,
    }),
}));
