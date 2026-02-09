import { motion } from "framer-motion";

export function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="prose prose-slate dark:prose-invert max-w-none"
      >
        <h1 className="text-4xl font-bold text-on-background mb-6">About Us</h1>
        <p className="text-lg text-muted leading-relaxed">
          We are a premium e-commerce platform dedicated to bringing you the
          best products with exceptional quality and service. Our mission is to
          make online shopping seamless, secure, and satisfying.
        </p>
        <p className="mt-4 text-muted leading-relaxed">
          From electronics to fashion, home goods to personal care, we curate a
          wide selection so you can find exactly what you need. Fast delivery,
          easy returns, and 24/7 customer support are at the heart of what we
          do.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Quality",
              desc: "Every product is vetted for quality and authenticity.",
            },
            {
              title: "Fast Delivery",
              desc: "Quick shipping so you get your orders on time.",
            },
            {
              title: "Support",
              desc: "Our team is here to help whenever you need.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-hover transition-shadow"
            >
              <h3 className="font-semibold text-on-background">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
