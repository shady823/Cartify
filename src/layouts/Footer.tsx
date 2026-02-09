import { Link } from "react-router-dom";
import { FiGithub, FiTwitter, FiInstagram } from "react-icons/fi";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-card)]/90 dark:bg-[var(--color-card)]/50 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link
              to="/home"
              className="inline-flex items-center gap-2 font-bold text-xl gradient-text"
            >
              <span className="text-2xl">🛒</span>
              Cartify
            </Link>
            <p className="mt-4 max-w-sm text-sm text-[var(--color-muted)] dark:text-[var(--color-muted-foreground)]">
              Premium e-commerce experience. Quality products, fast delivery,
              and exceptional customer service.
            </p>
            <div className="mt-4 flex gap-4">
              {[
                { Icon: FiTwitter, label: "Twitter" },
                { Icon: FiInstagram, label: "Instagram" },
                { Icon: FiGithub, label: "GitHub" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="p-2 rounded-xl hover:bg-[var(--color-card-hover)] dark:hover:bg-[var(--color-card-hover)] transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-[var(--color-muted)] dark:text-[var(--color-muted-foreground)">
              Shop
            </h3>
            <ul className="mt-4 space-y-2">
              {[
                { name: "All Products", to: "/products" },
                { name: "Categories", to: "/categories" },
                { name: "Brands", to: "/brands" },
                { name: "Cart", to: "/cart" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-[var(--color-muted)] dark:text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[var(--color-muted)] dark:text-[var(--color-muted-foreground)">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              {[
                { name: "About", to: "/about" },
                { name: "Profile", to: "/profile" },
                { name: "Orders", to: "/orders" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-[var(--color-muted)] dark:text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--color-border)] text-center text-sm text-[var(--color-muted)] dark:text-[var(--color-muted-foreground)]">
          © {new Date().getFullYear()} Cartify. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
