import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useMobileMenuStore } from "@/shared/types";

import LayoutHeader from "./layout_header.tsx";
import LayoutAside from "./layout_aside.tsx";
import DeleteNoteModal from "@/features/note-delete/ui/DeleteNoteModal";

export default function LayoutMenu() {
  const { isOpen: isMobileMenuOpen, closeMobileMenu } = useMobileMenuStore();

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMobileMenu, isMobileMenuOpen]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header
        className="fixed left-0 top-0 z-50 w-full border-b border-white/10"
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)", // Safari
        }}
      >
        <LayoutHeader />
      </header>

      <aside className="fixed inset-y-0 left-0 z-40 hidden pt-16 lg:block">
        <LayoutAside />
      </aside>

      <div
        aria-hidden={!isMobileMenuOpen}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={closeMobileMenu}
      />

      <aside
        aria-label="Мобильная навигация"
        className={`fixed bottom-0 left-0 top-16 z-50 w-[min(20rem,calc(100vw-2rem))] transition-transform duration-300 ease-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <LayoutAside onNavigate={closeMobileMenu} />
      </aside>

      <div className="relative z-10 pt-16 lg:ml-64">
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      <DeleteNoteModal />
    </div>
  );
}
