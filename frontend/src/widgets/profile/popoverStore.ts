import { create } from "zustand";

type PopoverType = "profile" | "notification" | null;

// const popover store (Notification, Profile menu)
type State = {
  openPopover: PopoverType;

  setPopover: (type: PopoverType) => void;
  togglePopover: (type: Exclude<PopoverType, null>) => void;
  closePopover: () => void;
};

export const usePopoverMenuStore = create<State>((set) => ({
  openPopover: null,

  setPopover: (type) => set({ openPopover: type }),

  togglePopover: (type) =>
    set((state) => ({
      openPopover: state.openPopover === type ? null : type,
    })),

  closePopover: () => set({ openPopover: null }),
}));
