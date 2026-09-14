import { useRef } from "react";
import { usePopoverMenuStore } from "@/types";
import { NavLink, useLocation } from "react-router-dom";
import { Bell } from "lucide-react";

import { isAuthenticated } from "../../auth/authStorage";
import ProfilePopover from "../Popover/ProfilePopover";

export default function LayoutHeader() {
  const location = useLocation();
  const isRegisterPage = location.pathname === "/register";

  const buttonRefProfile = useRef<HTMLButtonElement>(null);

  const { togglePopover } = usePopoverMenuStore();

  return (
    <div className="h-16 w-full flex justify-between border-b border-border-subtle px-4">
      <div className="flex items-center gap-3">
        <img src="/src/assets/Logo.png" alt="Logo" className="h-8 w-8" />
        <span className="text-[16px] font-semibold text-color-text-primary">
          Noteform
        </span>
      </div>
      {isAuthenticated() ? (
        <button
          aria-label="Open profile"
          ref={buttonRefProfile}
          onClick={() => togglePopover("profile")}

          className="flex gap-2 items-center "
        >
          <div className="bg-bg-input size-10 rounded-xl flex items-center justify-center text-text-secondary hover:text-text-primary border border-transparent hover:border-border-focus cursor-pointer transition-color duration-200">
            <Bell size={14} />
          </div>
          <div className="bg-indigo-500 rounded-full size-9 flex items-center justify-center border border-border-subtle hover:border-border-focus cursor-pointer transition-colors duration-200">
            Sd
          </div>
        </button>
      ) : (
        <div className="flex items-center text-[14px] gap-1 justify-center">
          <span className="text-text-secondary">
            {isRegisterPage ? "Уже есть аккаунт?" : "Новый здесь?"}
          </span>
          <NavLink
            to={isRegisterPage ? "/login" : "/register"}
            className="text-accent border-b border-transparent hover:border-accent cursor-pointer font-medium"
          >
            {isRegisterPage ? "Войти в аккаунт" : "Создать аккаунт"}
          </NavLink>
        </div>
      )}
      {isAuthenticated() && <ProfilePopover anchorRef={buttonRefProfile} />}
    </div>
  );
}
