import { motion } from "framer-motion";
import { useAuthStore } from "@/store";
import { FiUser, FiMail } from "react-icons/fi";

export function Profile() {
  const user = useAuthStore((s) => s.user);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <h1 className="text-3xl font-bold text-on-background mb-8">Profile</h1>
      <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-on-primary">
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-on-background flex items-center gap-2">
              <FiUser className="h-5 w-5 text-muted" />
              {user?.name ?? "—"}
            </h2>
            <p className="text-muted flex items-center gap-2">
              <FiMail className="h-4 w-4 text-muted" />
              {user?.email ?? "—"}
            </p>
            {user?.role && (
              <p className="text-sm text-muted capitalize">Role: {user.role}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
