import type { ReactNode } from "react";
import { Inbox, SearchX, ShoppingCart, Heart, PackageOpen, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = {
  empty: Inbox,
  search: SearchX,
  cart: ShoppingCart,
  wishlist: Heart,
  orders: PackageOpen,
  network: WifiOff,
};

export function EmptyState({
  icon = "empty",
  title,
  description,
  action,
  className,
}: {
  icon?: keyof typeof ICONS;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  const Icon = ICONS[icon];
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-card/50 px-6 py-16 text-center",
        className
      )}
    >
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-surface border border-line">
        <Icon className="h-6 w-6 text-muted" />
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-md text-sm text-muted">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
