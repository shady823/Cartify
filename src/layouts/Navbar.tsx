import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiLogOut,
  FiSun,
  FiMoon,
  FiMenu,
} from "react-icons/fi";
import { useAuthStore, useThemeStore } from "@/store";
import { useCartCount } from "@/hooks/useCartCount";
import { useWishlistCount } from "@/hooks/useWishlistCount";
import { CartDrawer } from "@/features/cart/CartDrawer";

export function Navbar({
  onToggleSidebar,
  searchQuery,
}: {
  onToggleSidebar: () => void;
  searchQuery: string;
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [draftQuery, setDraftQuery] = useState(searchQuery);
  const [badgesEnabled, setBadgesEnabled] = useState(false);
  const searchDebounceRef = useRef<number | null>(null);
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = useCartCount({ enabled: badgesEnabled });
  const wishlistCount = useWishlistCount({ enabled: badgesEnabled });

  useEffect(() => {
    setDraftQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const t = window.setTimeout(() => setBadgesEnabled(true), 800);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const isProductsList = location.pathname === "/products";
    if (!isProductsList) return;

    const next = draftQuery.trim();
    const current = searchQuery.trim();
    if (next === current) return;

    if (searchDebounceRef.current != null) {
      window.clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = window.setTimeout(() => {
      navigate(next ? `/products?q=${encodeURIComponent(next)}` : "/products");
    }, 350);

    return () => {
      if (searchDebounceRef.current != null) {
        window.clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = null;
      }
    };
  }, [draftQuery, searchQuery, location.pathname, navigate]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--color-background)]/90 dark:bg-[var(--color-background)]/90 border-b border-border shadow-soft">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl hover:bg-card-hover transition-colors"
              aria-label="Toggle sidebar"
            >
              <FiMenu className="h-6 w-6 text-foreground" />
            </button>
            <Link
              to="/home"
              className="flex items-center gap-2 font-bold text-xl gradient-text"
            >
              <span className="text-2xl">🛒</span>
              Cartify
            </Link>
          </div>

          <form
            className="hidden sm:flex flex-1 max-w-md mx-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchDebounceRef.current != null) {
                window.clearTimeout(searchDebounceRef.current);
                searchDebounceRef.current = null;
              }
              const q = draftQuery.trim();
              navigate(
                q ? `/products?q=${encodeURIComponent(q)}` : "/products",
              );
            }}
          >
            <div className="relative w-full">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search products..."
                value={draftQuery}
                onChange={(e) => setDraftQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-2xl border border-border bg-card dark:bg-card-dark focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground dark:text-foreground-dark"
              />
            </div>
          </form>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-card-hover transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <FiMoon className="h-5 w-5 text-foreground" />
              ) : (
                <FiSun className="h-5 w-5 text-foreground" />
              )}
            </button>

            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-xl hover:bg-card-hover transition-colors"
            >
              <FiHeart className="h-5 w-5 text-foreground" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-xl hover:bg-card-hover transition-colors"
            >
              <FiShoppingCart className="h-5 w-5 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-card-hover transition-colors"
              >
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary font-semibold">
                  {user?.name?.charAt(0).toUpperCase() ?? "U"}
                </div>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      aria-hidden
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border bg-card dark:bg-card-dark shadow-hover z-50 py-2"
                    >
                      <div className="px-4 py-2 border-b border-border">
                        <p className="font-medium truncate text-foreground dark:text-foreground-dark">
                          {user?.name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-card-hover dark:hover:bg-card-hover-dark"
                      >
                        <FiUser className="h-4 w-4" />
                        Profile
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-error hover:bg-error-hover dark:hover:bg-error-hover-dark"
                      >
                        <FiLogOut className="h-4 w-4" />
                        Log out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
