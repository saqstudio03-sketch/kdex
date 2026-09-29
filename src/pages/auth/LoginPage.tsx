import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { usePageSeo } from "@/hooks/usePageSeo";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  usePageSeo({ title: "Sign In — KDex Games", canonicalPath: "/login" });
  const { login, loginWithGoogle, sendPasswordReset, loading } = useAuth();
  const { toast } = useStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMode, setResetMode] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (resetMode) {
        await sendPasswordReset(email);
        toast("Password reset email sent (demo)", "success");
        setResetMode(false);
        return;
      }
      await login(email, password);
      toast("Welcome back!", "success");
      navigate("/account");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <AuthCard
      title={resetMode ? "Reset your password" : "Welcome back"}
      subtitle={
        resetMode
          ? "We'll send a reset link to your inbox."
          : "Sign in to access your library, orders and wishlist."
      }
      footer={
        resetMode ? (
          <button onClick={() => setResetMode(false)} className="text-accent hover:underline">
            ← Back to sign in
          </button>
        ) : (
          <>
            New to KDex?{" "}
            <Link to="/register" className="font-medium text-accent hover:underline">
              Create an account
            </Link>
          </>
        )
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase text-muted">Email</span>
          <div className="flex items-center gap-2 rounded-lg border border-line bg-card px-3 focus-within:border-accent/60">
            <Mail className="h-4 w-4 text-muted" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-muted"
            />
          </div>
        </label>

        {!resetMode && (
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase text-muted">Password</span>
            <div className="flex items-center gap-2 rounded-lg border border-line bg-card px-3 focus-within:border-accent/60">
              <Lock className="h-4 w-4 text-muted" />
              <input
                type={show ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-muted"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label="Toggle password visibility"
                className="text-muted hover:text-white"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>
        )}

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          {resetMode ? "Send reset link" : "Sign in"}
        </Button>

        {!resetMode && (
          <>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
            </div>
            <Button
              type="button"
              variant="dark"
              size="lg"
              className="w-full"
              loading={loading}
              onClick={async () => {
                await loginWithGoogle();
                toast("Signed in with Google (demo)", "success");
                navigate("/account");
              }}
            >
              Continue with Google
            </Button>
            <div className="text-right">
              <button
                type="button"
                onClick={() => setResetMode(true)}
                className="text-xs text-muted hover:text-accent"
              >
                Forgot password?
              </button>
            </div>
          </>
        )}
      </form>
    </AuthCard>
  );
}
