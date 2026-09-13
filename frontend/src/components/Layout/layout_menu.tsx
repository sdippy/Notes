import { Outlet } from "react-router-dom";

import LayoutHeader from "./layout_header.tsx";
import LayoutAside from "./layout_aside.tsx";

export default function LayoutMenu() {
  return (
    <div className="flex flex-col w-full h-full">
      <header
        className="fixed top-0 left-0 w-full z-50 border-b border-white/10"
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)", // Safari
        }}
      >
        <LayoutHeader />
      </header>

      <aside className="fixed inset-y-0 left-0 z-40 pt-16">
        <LayoutAside />
      </aside>

      <div className="relative z-10 ml-64 pt-16">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
