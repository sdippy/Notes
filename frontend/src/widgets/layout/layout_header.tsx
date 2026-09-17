import { useRef } from "react";
import { usePopoverMenuStore } from "@/shared/types";
import { NavLink, useLocation } from "react-router-dom";
import { Bell, Menu, X } from "lucide-react";
import logo from "@/assets/Logo.png";
import { useMobileMenuStore } from "@/shared/types";

import { isAuthenticated } from "@/features/auth/lib/authStorage";
import ProfilePopover from "@/widgets/profile/ui/ProfilePopover";

export default function LayoutHeader() {
  const location = useLocation();
  const isRegisterPage = location.pathname === "/register";

  const buttonRefProfile = useRef<HTMLButtonElement>(null);

  const { togglePopover } = usePopoverMenuStore();
  const { isOpen: isMobileMenuOpen, toggleMobileMenu } = useMobileMenuStore();

  return (
    <div className="flex h-16 w-full items-center justify-between border-b border-border-subtle px-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        {isAuthenticated() && (
          <button
            type="button"
            aria-label={isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={isMobileMenuOpen}
            onClick={toggleMobileMenu}
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-transparent text-text-secondary transition-all duration-200 hover:border-border-focus hover:bg-bg-input hover:text-text-primary lg:hidden"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        )}
        <img src={logo} alt="Logo" className="h-8 w-8 shrink-0" />
        <span className="truncate text-[16px] font-semibold text-color-text-primary">
          Noteform
        </span>
      </div>
      {isAuthenticated() ? (
        <div className="flex gap-2 items-center ">
          <div className="bg-bg-input size-10 rounded-xl flex items-center justify-center text-text-secondary hover:text-text-primary border border-transparent hover:border-border-focus cursor-pointer transition-color duration-200">
            <Bell size={14} />
          </div>
          <button
            aria-label="Open profile"
            ref={buttonRefProfile}
            onClick={() => togglePopover("profile")}
            className="bg-indigo-500 rounded-full size-9 flex items-center justify-center border border-border-subtle hover:border-border-focus cursor-pointer transition-colors duration-200"
          >
            Sd
          </button>
        </div>
      ) : (
        <div className="flex max-w-[65%] flex-wrap items-center justify-end gap-1 text-right text-[12px] sm:text-[14px]">
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
