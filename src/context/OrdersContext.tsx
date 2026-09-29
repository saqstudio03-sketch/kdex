import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DemoKey, Order, OrderLine, SupportTicket } from "@/types";
import { load, save } from "@/lib/storage";
import { uid } from "@/lib/utils";

/**
 * Orders, digital-key fulfilment and support tickets.
 *
 * ⚠️ DEMO FULFILMENT — clearly labelled everywhere in the UI.
 *
 * The function below mirrors the production flow implemented as a Cloud
 * Function (see README → "Payment & fulfilment"):
 *   createPaymentOrder → verify signature → check inventory →
 *   Firestore transaction reserves an UNUSED key → mark sold → fulfil order.
 * Keys are never readable from client queries in production; here they are
 * simulated locally so the whole purchase journey can be exercised.
 */

export interface PlaceOrderInput {
  email: string;
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  total: number;
  paymentMethod: string;
}

interface OrdersCtx {
  orders: Order[];
  tickets: SupportTicket[];
  placing: boolean;
  placeOrder: (input: PlaceOrderInput) => Promise<Order>;
  keyFor: (orderId: string, productId: string) => DemoKey | undefined;
  revealKey: (orderId: string, productId: string) => void;
  revealed: string[];
  createTicket: (
    t: Omit<SupportTicket, "id" | "status" | "createdAt">
  ) => Promise<void>;
  respondTicket: (id: string, reply: string) => void;
}

const OrdersContext = createContext<OrdersCtx | null>(null);

/** Demo key generator — production keys come from the `digitalKeys` pool. */
function demoKey(productId: string): string {
  const block = () =>
    Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4).padEnd(4, "0");
  return `NX-${productId.toUpperCase()}-${block()}-${block()}-${block()}`;
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => load<Order[]>("orders", []));
  const [tickets, setTickets] = useState<SupportTicket[]>(() =>
    load<SupportTicket[]>("tickets", [])
  );
  const [revealed, setRevealed] = useState<string[]>([]);
  const [placing, setPlacing] = useState(false);

  useEffect(() => save("orders", orders), [orders]);
  useEffect(() => save("tickets", tickets), [tickets]);

  const placeOrder = useCallback(
    async (input: PlaceOrderInput): Promise<Order> => {
      setPlacing(true);
      try {
        // 1. Backend would create the Razorpay order here.
        await new Promise((r) => setTimeout(r, 900));
        // 2. Backend would verify the payment signature — never trusted from client.
        await new Promise((r) => setTimeout(r, 700));

        const keys: DemoKey[] = input.lines.flatMap((l) =>
          Array.from({ length: l.qty }, () => ({
            productId: l.productId,
            key: demoKey(l.productId),
            status: "sold" as const,
          }))
        );

        const order: Order = {
          id: `NX${Date.now().toString().slice(-8)}`,
          createdAt: new Date().toISOString(),
          email: input.email,
          items: input.lines,
          subtotal: input.subtotal,
          discount: input.discount,
          couponCode: input.couponCode,
          tax: input.tax,
          total: input.total,
          paymentStatus: "paid",
          paymentMethod: input.paymentMethod,
          fulfillmentStatus: "demo",
          status: "fulfilled",
          keys,
          demo: true,
        };
        setOrders((o) => [order, ...o]);
        return order;
      } finally {
        setPlacing(false);
      }
    },
    []
  );

  const keyFor = useCallback(
    (orderId: string, productId: string) =>
      orders.find((o) => o.id === orderId)?.keys.find((k) => k.productId === productId),
    [orders]
  );

  const revealKey = useCallback((orderId: string, productId: string) => {
    setRevealed((r) => [...r, `${orderId}:${productId}`]);
  }, []);

  const createTicket = useCallback(
    async (t: Omit<SupportTicket, "id" | "status" | "createdAt">) => {
      await new Promise((r) => setTimeout(r, 500));
      setTickets((list) => [
        {
          ...t,
          id: uid("tkt"),
          status: "open",
          createdAt: new Date().toISOString(),
        },
        ...list,
      ]);
    },
    []
  );

  const respondTicket = useCallback((id: string, reply: string) => {
    setTickets((list) =>
      list.map((t) => (t.id === id ? { ...t, reply, status: "answered" } : t))
    );
  }, []);

  const value = useMemo(
    () => ({ orders, tickets, placing, placeOrder, keyFor, revealKey, revealed, createTicket, respondTicket }),
    [orders, tickets, placing, placeOrder, keyFor, revealKey, revealed, createTicket, respondTicket]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders(): OrdersCtx {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used inside OrdersProvider");
  return ctx;
}
