import { create } from "zustand";

type MobileMenuState = {
  isOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
};

export const useMobileMenuStore = create<MobileMenuState>((set) => ({
  isOpen: false,
  toggleMobileMenu: () => set((state) => ({ isOpen: !state.isOpen })),
  closeMobileMenu: () => set({ isOpen: false }),
}));
