import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSearch } from "react-icons/fi";
import { cn } from "@/utils/cn";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const [draftQuery, setDraftQuery] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 border-r border-[var(--color-border)] bg-[var(--color-background)] lg:static lg:z-auto lg:block lg:h-auto lg:w-64 lg:border-r lg:shrink-0",
          !open && "hidden lg:block",
        )}
      >
        <motion.div
          initial={false}
          animate={open ? { x: 0 } : { x: -288 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="flex h-full flex-col lg:!translate-x-0 lg:!animate-none"
        >
          <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)] lg:border-0">
            <span className="font-semibold text-lg text-[var(--color-foreground)]">
              Navigation
            </span>
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl hover:bg-[var(--color-card-hover)] transition-colors"
              aria-label="Close sidebar"
            >
              <FiX className="h-5 w-5 text-[var(--color-foreground)]" />
            </button>
          </div>

          {/* Search Form */}
          <form
            className="p-4"
            onSubmit={(e) => {
              e.preventDefault();
              const q = draftQuery.trim();
              navigate(
                q ? `/products?q=${encodeURIComponent(q)}` : "/products",
              );
              onClose();
            }}
          >
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search products..."
                value={draftQuery}
                onChange={(e) => setDraftQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-3 rounded-xl border border-border bg-card dark:bg-card-dark focus:ring-2 focus:ring-primary text-foreground dark:text-foreground-dark"
              />
            </div>
          </form>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-4">
            <Link
              to="/categories"
              className="block px-4 py-3 rounded-xl text-left font-medium hover:bg-[var(--color-card-hover)] transition-colors"
            >
              Categories
            </Link>
            <Link
              to="/brands"
              className="block px-4 py-3 rounded-xl text-left font-medium hover:bg-[var(--color-card-hover)] transition-colors"
            >
              Brands
            </Link>
          </nav>
        </motion.div>
      </aside>
    </>
  );
}
