"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  GoogleAuthProvider,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { setAuthTokenProvider } from "@/lib/api";

const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_ENABLED === "true";

interface AuthState {
  user: User | null;
  loading: boolean;
  authEnabled: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  authEnabled: AUTH_ENABLED,
  signIn: async () => {},
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(AUTH_ENABLED);

  useEffect(() => {
    if (!AUTH_ENABLED) {
      setLoading(false);
      return;
    }

    const auth = getFirebaseAuth();

    setAuthTokenProvider(async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;
      return currentUser.getIdToken();
    });

    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser);
      setLoading(false);
    });

    return unsub;
  }, []);

  const signIn = useCallback(async () => {
    if (!AUTH_ENABLED) return;
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }, []);

  const signOut = useCallback(async () => {
    if (!AUTH_ENABLED) return;
    const auth = getFirebaseAuth();
    await fbSignOut(auth);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, authEnabled: AUTH_ENABLED, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
