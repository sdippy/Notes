import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { removeToken } from "@/auth/authStorage";
import { Settings, Inbox, Palette, LogOut } from "lucide-react";
import { usePopoverMenuStore } from "@/types";

interface ProfilePopoverProps {
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}

export default function ProfilePopover({ anchorRef }: ProfilePopoverProps) {
  const { openPopover } = usePopoverMenuStore();
  const { pathname } = useLocation();

  const isOpen = openPopover === "profile";

  const popoverRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({
    top: 0,
    right: 0,
  });

  // позиционирование
  useEffect(() => {
    if (!anchorRef.current) return;

    const rect = anchorRef.current.getBoundingClientRect();

    setPosition({
      top: rect.bottom,
      right: window.innerWidth - rect.right,
    });
  }, [isOpen, anchorRef]);

  const close = usePopoverMenuStore((s) => s.closePopover);

  useEffect(() => {
    close();
  }, [pathname, close]);

  // outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: PointerEvent) => {
      const target = e.target as Node;

      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        !anchorRef.current?.contains(target)
      ) {
        close();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, close]);

  //   const avatar = "/Profile_img.jpeg";

  interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    color: string;
    isLast?: boolean;
    onClick?: () => void;
  }

  function MenuItem({ icon, label, color, isLast, onClick }: MenuItemProps) {
    const hoverClasses = isLast
      ? "hover:bg-red-500/10 hover:text-[#ef4444]"
      : "hover:bg-bg-hover hover:text-accent";

    return (
      <button
        className={`flex items-center gap-2.5 w-full rounded-xl pl-5 pr-5 py-2.5 ${color} ${hoverClasses} cursor-pointer transition-all duration-200`}
        onClick={onClick}
      >
        {icon}
        <span className="text-[14px]">{label}</span>
      </button>
    );
  }

  const navigate = useNavigate();

  function handleLogout() {
    removeToken();
    navigate("/login", { replace: true });
  }

  return createPortal(
    isOpen && (
      <div
        ref={popoverRef}
        style={{
          position: "fixed",
          top: position.top,
          right: position.right,
        }}
        className="absolute z-50 w-70 bg-bg-card border border-border-subtle rounded-xl p-1.5"
      >
        <div className="px-5 py-2.5 flex gap-2.5 items-center">
          {/* <img
            src={avatar}
            alt="Profile"
            className="size-4 rounded-full object-cover"
          /> */}

          <div className="bg-indigo-500 rounded-full size-9 flex items-center justify-center">
            Sd
          </div>
          <div className="flex flex-col">
            <span className="text-[16px] font-medium">Test1</span>
            <span className="text-[14px] text-text-secondary">test@ex.com</span>
          </div>
        </div>
        <div className="border-t border-b border-border-subtle py-1.5 my-1.5">
          <MenuItem
            icon={<Inbox size={18} />}
            label="Мои заметки"
            color="text-text-primary"
          />
          <MenuItem
            icon={<Settings size={18} />}
            label="Настройки"
            color="text-text-primary"
          />
          <MenuItem
            icon={<Palette size={18} />}
            label="Тема: AMOLED"
            color="text-text-primary"
          />
        </div>
        <MenuItem
          icon={<LogOut size={18} />}
          label="Выйти из аккаунта"
          color="text-[#ef4444]"
          isLast={true}
          onClick={handleLogout}
        />
      </div>
    ),
    document.body,
  );
}
