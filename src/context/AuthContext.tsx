import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/types";
import { load, save, remove } from "@/lib/storage";
import { uid } from "@/lib/utils";
import { isFirebaseConfigured } from "@/lib/firebase";

/**
 * Authentication context.
 *
 * Firebase Auth is NOT configured in this environment, so a local demo
 * provider simulates the exact same API surface (register, login, Google,
 * reset, verification, logout). Swap the bodies for Firebase calls once
 * credentials exist — the rest of the app doesn't change.
 */

interface RegisterArgs {
  email: string;
  password: string;
  displayName: string;
}

interface AuthCtx {
  user: User | null;
  demoMode: boolean;
  loading: boolean;
  register: (a: RegisterArgs) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  verifyEmail: () => Promise<void>;
  updateProfile: (patch: Partial<Pick<User, "displayName" | "email">>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

function fakeDelay(ms = 500) {
  return new Promise((r) => setTimeout(r, ms));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => load<User | null>("user", null));
  const [loading, setLoading] = useState(false);

  useEffect(() => save("user", user), [user]);

  const register = useCallback(async ({ email, password, displayName }: RegisterArgs) => {
    setLoading(true);
    try {
      await fakeDelay();
      if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Enter a valid email address.");
      if (password.length < 6) throw new Error("Password must be at least 6 characters.");
      if (load<Record<string, string>>("passwords", {})[email.toLowerCase()])
        throw new Error("An account with this email already exists.");
      const passwords = load<Record<string, string>>("passwords", {});
      passwords[email.toLowerCase()] = password; // demo only — Firebase hashes in production
      save("passwords", passwords);
      setUser({
        uid: uid("usr"),
        email,
        displayName: displayName || email.split("@")[0],
        emailVerified: false,
        provider: "password",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      await fakeDelay();
      const passwords = load<Record<string, string>>("passwords", {});
      const stored = passwords[email.toLowerCase()];
      if (stored && stored !== password) throw new Error("Incorrect password.");
      if (!stored && password.length < 6) throw new Error("Invalid credentials.");
      const known = load<User | null>("user", null);
      if (known && known.email.toLowerCase() === email.toLowerCase()) {
        setUser(known);
      } else {
        setUser({
          uid: uid("usr"),
          email,
          displayName: email.split("@")[0],
          emailVerified: Boolean(stored),
          provider: "password",
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      await fakeDelay(700);
      setUser({
        uid: uid("usr"),
        email: "player@kdex.demo",
        displayName: "KDex Player",
        emailVerified: true,
        provider: "google",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    await fakeDelay(600);
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Enter a valid email address.");
    // Firebase would send `sendPasswordResetEmail(email)` here.
  }, []);

  const verifyEmail = useCallback(async () => {
    await fakeDelay(400);
    setUser((u) => (u ? { ...u, emailVerified: true } : u));
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<Pick<User, "displayName" | "email">>) => {
      setUser((u) => (u ? { ...u, ...patch } : u));
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    remove("user");
  }, []);

  const value = useMemo(
    () => ({
      user,
      demoMode: !isFirebaseConfigured,
      loading,
      register,
      login,
      loginWithGoogle,
      sendPasswordReset,
      verifyEmail,
      updateProfile,
      logout,
    }),
    [user, loading, register, login, loginWithGoogle, sendPasswordReset, verifyEmail, updateProfile, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
