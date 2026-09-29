import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, XCircle, X } from "lucide-react";
import { useStore } from "@/context/StoreContext";

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const COLORS = {
  success: "text-success",
  error: "text-danger",
  info: "text-accent",
};

export function Toaster() {
  const { toasts, dismissToast } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-20 right-4 z-[100] flex flex-col gap-2 md:bottom-6 md:right-6">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.type];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="pointer-events-auto flex w-80 items-start gap-3 rounded-xl border border-line bg-card/95 p-3.5 shadow-lift backdrop-blur"
            >
              <Icon className={cnIcon(COLORS[t.type])} />
              <p className="flex-1 text-sm text-white">{t.message}</p>
              <button
                onClick={() => dismissToast(t.id)}
                className="text-muted transition hover:text-white"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function cnIcon(cls: string) {
  return `h-5 w-5 shrink-0 ${cls}`;
}
