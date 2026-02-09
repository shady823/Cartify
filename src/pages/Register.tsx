import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authApi } from "@/api";
import { useAuthStore } from "@/store";
import { Button } from "@/components/ui";
import type { RegisterPayload } from "@/types";

export function Register() {
  const [form, setForm] = useState<RegisterPayload>({
    name: "",
    email: "",
    password: "",
    rePassword: "",
  });
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setAuth = useAuthStore((s) => s.setAuth);

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) =>
      authApi.register(payload).then((r) => r.data),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success("Account created!");
      navigate("/home", { replace: true });
    },
    onError: (err: {
      response?: {
        data?: { message?: string; errors?: Record<string, string> };
      };
    }) => {
      const msg = err.response?.data?.message;
      const errors = err.response?.data?.errors;
      if (errors && Object.keys(errors).length) {
        const first = Object.values(errors)[0];
        toast.error(first ?? "Registration failed");
      } else {
        toast.error(msg ?? "Registration failed");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.rePassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    registerMutation.mutate(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4 py-12">
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
              <span className="text-3xl">🛒</span>
              Cartify
            </Link>

            <h1 className="mt-6 text-2xl font-bold text-[var(--color-foreground)]">
              Create your account
            </h1>

            <p className="mt-2 text-[var(--color-muted-foreground)]">
              Join us and start shopping
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[var(--color-muted-foreground)] mb-1.5"
              >
                Name
              </label>

              <input
                id="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
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
                placeholder="Your name"
              />
            </div>

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
                autoComplete="new-password"
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

            {/* Confirm password */}
            <div>
              <label
                htmlFor="rePassword"
                className="block text-sm font-medium text-[var(--color-muted-foreground)] mb-1.5"
              >
                Confirm password
              </label>

              <input
                id="rePassword"
                type="password"
                autoComplete="new-password"
                value={form.rePassword}
                onChange={(e) =>
                  setForm((f) => ({ ...f, rePassword: e.target.value }))
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
              loading={registerMutation.isPending}
            >
              Create account
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-[var(--color-muted-foreground)]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[var(--color-primary)] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
