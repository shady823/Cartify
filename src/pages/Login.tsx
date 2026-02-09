import { useState } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authApi } from "@/api";
import { useAuthStore } from "@/store";
import { Button } from "@/components/ui";
import type { LoginPayload } from "@/types";

export function Login() {
  const [form, setForm] = useState<LoginPayload>({ email: "", password: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setAuth = useAuthStore((s) => s.setAuth);
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    "/home";

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) =>
      authApi.login(payload).then((r) => r.data),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? "Login failed");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    loginMutation.mutate(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div
          className="
          rounded-[var(--radius-3xl)]
          border border-[var(--color-border)]
          bg-[var(--color-card)]
          shadow-[var(--shadow-hover)]
          p-8
        "
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              to="/home"
              className="inline-flex items-center gap-2 font-bold text-2xl gradient-text"
            >
              <span className="text-3xl ">🛒</span>
              Cartify
            </Link>

            <h1 className="mt-6 text-2xl font-bold text-[var(--color-foreground)]">
              Sign in to your account
            </h1>

            <p className="mt-2 text-[var(--color-muted-foreground)]">
              Enter your credentials to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--color-muted-foreground)] mb-1.5"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className="
                w-full h-12 px-4
                rounded-[var(--radius-xl)]
                border border-[var(--color-border)]
                bg-[var(--color-card)]
                text-[var(--color-foreground)]
                focus:ring-2 focus:ring-[var(--color-primary)]
                outline-none transition
              "
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--color-muted-foreground)] mb-1.5"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                className="
                w-full h-12 px-4
                rounded-[var(--radius-xl)]
                border border-[var(--color-border)]
                bg-[var(--color-card)]
                text-[var(--color-foreground)]
                focus:ring-2 focus:ring-[var(--color-primary)]
                outline-none transition
              "
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loginMutation.isPending}
            >
              Sign in
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-[var(--color-muted-foreground)]">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[var(--color-primary)] hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
