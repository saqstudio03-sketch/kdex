import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { usePageSeo } from "@/hooks/usePageSeo";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  usePageSeo({ title: "Create Account — KDex Games", canonicalPath: "/register" });
  const { register, loading } = useAuth();
  const { toast } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [agree, setAgree] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    if (!agree) return setError("Please accept the terms of use.");
    try {
      await register({
        email: form.email,
        password: form.password,
        displayName: form.name,
      });
      toast("Account created — verification email sent (demo)", "success");
      navigate("/account");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const field = (
    key: keyof typeof form,
    label: string,
    type: string,
    Icon: typeof Mail
  ) => (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase text-muted">{label}</span>
      <div className="flex items-center gap-2 rounded-lg border border-line bg-card px-3 focus-within:border-accent/60">
        <Icon className="h-4 w-4 text-muted" />
        <input
          type={type}
          required={key !== "confirm"}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-muted"
          placeholder={label}
        />
        {key === "password" && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            aria-label="Toggle password visibility"
            className="text-muted hover:text-white"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </label>
  );

  return (
    <AuthCard
      title="Create your account"
      subtitle="One account for purchases, keys, wishlist and reviews."
      footer={
        <>
          Already registered?{" "}
          <Link to="/login" className="font-medium text-accent hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        {field("name", "Display name", "text", User)}
        {field("email", "Email", "email", Mail)}
        <div className="grid gap-4 sm:grid-cols-2">
          {field("password", "Password", show ? "text" : "password", Lock)}
          {field("confirm", "Confirm password", show ? "text" : "password", Lock)}
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 text-xs text-muted">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 accent-accent"
          />
          I agree to the terms of use and privacy policy, and understand this is a demo
          project that stores account data locally in my browser.
        </label>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Create account
        </Button>
      </form>
    </AuthCard>
  );
}
