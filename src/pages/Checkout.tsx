import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { cartApi } from "@/api";
import { Button, Skeleton } from "@/components/ui";
import type { ShippingAddress } from "@/types";
import { useCartQuery } from "@/hooks/useCartQuery";
import { FiCreditCard, FiDollarSign } from "react-icons/fi";
import { saveOrder, generateOrderId } from "@/utils/orders";

const initialAddress: ShippingAddress = {
  details: "",
  phone: "",
  city: "",
};

export function Checkout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [address, setAddress] = useState<ShippingAddress>(initialAddress);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "visa">("cash");
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

  const { data: cartData, isLoading: cartLoading } = useCartQuery();
  const cart = cartData?.data;
  const items = cart?.products ?? [];
  const total = items.reduce((sum, item) => {
    const unitPrice = item.product?.priceAfterDiscount ?? item.price;
    return sum + unitPrice * item.count;
  }, 0);
  const isEmpty = items.length === 0;

  const validateField = (field: keyof ShippingAddress, value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setErrors((e) => ({ ...e, [field]: `${field} is required` }));
      return false;
    }

    if (field === "phone") {
      const digitsOnly = trimmed.replace(/\s+/g, "");
      if (!/^\d{10,}$/.test(digitsOnly)) {
        setErrors((e) => ({
          ...e,
          phone: "Phone must be at least 10 digits (numbers only)",
        }));
        return false;
      }
    }

    setErrors((e) => ({ ...e, [field]: "" }));
    return true;
  };

  const createOrder = useMutation({
    mutationFn: () => {
      // Create and save the order with all details
      const order = {
        _id: generateOrderId(),
        shippingAddress: address,
        cartItems: items.map((item) => ({
          product:
            item.product?.id ?? (item.product as { _id?: string })?._id ?? "",
          count: item.count,
          price: item.product?.priceAfterDiscount ?? item.price,
        })),
        totalOrderPrice: total,
        createdAt: new Date().toISOString(),
        isPaid: false,
        isDelivered: false,
      };
      saveOrder(order);
      // Then clear the cart
      return cartApi.clear();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Order placed successfully!");
      navigate("/orders");
    },
    onError: () => toast.error("Failed to complete order"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    for (const field of ["details", "city", "phone"] as const) {
      if (!validateField(field, address[field])) {
        isValid = false;
      }
    }

    if (!isValid) {
      toast.error("Please fix the errors above");
      return;
    }

    // All data is correct, place the order
    createOrder.mutate();
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <Skeleton className="h-64 rounded-[var(--radius-2xl)]" />
      </div>
    );
  };

  if (isEmpty) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl px-4 py-16 text-center"
      >
        <h1 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">
          Your cart is empty
        </h1>
        <Button variant="primary" onClick={() => navigate("/products")}>
          Browse products
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-8">
        Checkout
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipping card */}
        <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-[var(--shadow-soft)] space-y-4">
          <h2 className="font-semibold text-[var(--color-foreground)]">
            Shipping address
          </h2>

          {(["details", "city", "phone"] as const).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-[var(--color-muted-foreground)] mb-1 capitalize">
                {field === "details" ? "Address" : field}
              </label>

              <input
                type={field === "phone" ? "tel" : "text"}
                value={address[field]}
                onChange={(e) => {
                  setAddress((a) => ({ ...a, [field]: e.target.value }));
                  validateField(field, e.target.value);
                }}
                onBlur={(e) => validateField(field, e.target.value)}
                className={`w-full h-11 px-4 rounded-[var(--radius-xl)]
                           border transition
                           bg-[var(--color-card)]
                           text-[var(--color-foreground)]
                           focus:ring-2 focus:outline-none
                           ${
                             errors[field]
                               ? "border-error focus:ring-error/20"
                               : "border-[var(--color-border)] focus:ring-[var(--color-primary)] focus:border-transparent"
                           }`}
                placeholder={
                  field === "phone"
                    ? "01234567890"
                    : field === "details"
                      ? "Street, building, apartment"
                      : "Cairo"
                }
              />
              {errors[field] && (
                <p className="text-xs text-error mt-1">{errors[field]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Payment card */}
        <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-[var(--shadow-soft)] space-y-4">
          <h2 className="font-semibold text-[var(--color-foreground)]">
            Payment method
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { id: "cash", label: "Cash on delivery", icon: FiDollarSign },
              { id: "visa", label: "Visa / Card payment", icon: FiCreditCard },
            ].map((method) => {
              const Icon = method.icon;
              const active = paymentMethod === method.id;

              return (
                <motion.button
                  key={method.id}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setPaymentMethod(method.id as "cash" | "visa")}
                  className={`
            relative flex items-center gap-4 p-4 rounded-2xl border text-left
            transition-all duration-200
            ${
              active
                ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30 bg-[var(--color-card-hover)]"
                : "border-[var(--color-border)] hover:bg-[var(--color-card-hover)]"
            }
          `}
                >
                  <div
                    className={`
              h-11 w-11 rounded-xl flex items-center justify-center
              ${
                active
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-card-hover)] text-[var(--color-muted-foreground)]"
              }
            `}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-[var(--color-foreground)]">
                      {method.label}
                    </p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">
                      {method.id === "visa"
                        ? "Secure online payment"
                        : "Pay when the order arrives"}
                    </p>
                  </div>

                  <AnimatePresence>
                    {active && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute top-2 right-2 h-3 w-3 rounded-full bg-[var(--color-primary)]"
                      />
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Summary card */}
        <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-[var(--shadow-soft)] space-y-4">
          <div className="space-y-2 text-sm">
            {items.map((item) => {
              const unitPrice = item.product?.priceAfterDiscount ?? item.price;
              return (
                <div
                  key={item._id}
                  className="flex justify-between text-[var(--color-muted-foreground)]"
                >
                  <span>
                    {item.product?.title} × {item.count}
                  </span>
                  <span className="text-[var(--color-foreground)] font-medium">
                    EGP {unitPrice * item.count}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="h-px bg-[var(--color-border)]" />

          <div className="flex justify-between text-lg font-semibold text-[var(--color-foreground)]">
            <span>Total</span>
            <span>EGP {total}</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={createOrder.isPending}
            disabled={
              Object.values(errors).some((e) => e) ||
              Object.values(address).some((v) => !v.trim())
            }
          >
            Place order
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
