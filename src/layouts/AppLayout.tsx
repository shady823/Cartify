import { useState } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
import { useSearchParamsState } from "@/hooks/useSearchParamsState";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery] = useSearchParamsState("q", "");

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-slate-50 dark:bg-none dark:bg-[var(--color-background)]">
      <ScrollRestoration getKey={(location) => location.pathname} />
      <Navbar
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
        searchQuery={searchQuery}
      />
      <div className="flex flex-1">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-x-hidden">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
      <Footer />
    </div>
  );
}
