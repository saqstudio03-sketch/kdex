import { Link, useLocation } from "react-router-dom";
import { Gamepad2 } from "lucide-react";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Button } from "@/components/ui/Button";

export default function NotFoundPage() {
  const { pathname } = useLocation();
  usePageSeo({
    title: "Page not found — Nexora Games",
    description: "The page you were looking for does not exist.",
    canonicalPath: pathname,
  });

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <Gamepad2 className="h-10 w-10 text-accent" />
      <p className="mt-6 font-display text-7xl font-bold text-accent">404</p>
      <h1 className="mt-3 font-display text-2xl font-bold">You wandered off the map</h1>
      <p className="mt-2 text-sm text-muted">
        The page <span className="font-mono text-white">{pathname}</span> doesn't exist — maybe
        a game was delisted, or a link got corrupted.
      </p>
      <div className="mt-7 flex gap-3">
        <Link to="/">
          <Button>Back home</Button>
        </Link>
        <Link to="/games">
          <Button variant="outline">Browse games</Button>
        </Link>
      </div>
    </div>
  );
}
