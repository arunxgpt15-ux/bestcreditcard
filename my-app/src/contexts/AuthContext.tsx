"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { compareHash, generateSalt, hashPassword } from "@/src/lib/crypto";
import { readStorage, removeStorage, writeStorage } from "@/src/lib/storage";
import type { AuthStatus, PublicUser, User } from "@/src/lib/types";

type AuthContextValue = {
  user: PublicUser | null;
  status: AuthStatus;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
};

const STORAGE_KEY = "bestcreditcard:auth:v1";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function makePublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    const hydrationId = window.setTimeout(() => {
      const saved = readStorage<User | null>(STORAGE_KEY, null);
      if (saved) {
        setUser(makePublicUser(saved));
        setStatus("authenticated");
      } else {
        setStatus("anonymous");
      }
    }, 0);
    return () => window.clearTimeout(hydrationId);
  }, []);

  const signUp = async (name: string, email: string, password: string) => {
    const salt = await generateSalt();
    const passwordHash = await hashPassword(password, salt);

    const nextUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      createdAt: Date.now(),
      salt,
      passwordHash,
    };

    const publicUser = makePublicUser(nextUser);

    writeStorage(STORAGE_KEY, nextUser);
    setUser(publicUser);
    setStatus("authenticated");
    return true;
  };

  const signIn = async (email: string, password: string) => {
    const stored = readStorage<User | null>(STORAGE_KEY, null);

    if (!stored || stored.email.toLowerCase() !== email.toLowerCase()) {
      setStatus("anonymous");
      return false;
    }

    const match = await compareHash(password, stored.salt, stored.passwordHash);

    if (!match) {
      setStatus("anonymous");
      return false;
    }

    setUser(makePublicUser(stored));
    setStatus("authenticated");
    return true;
  };

  const signOut = () => {
    removeStorage(STORAGE_KEY);
    setUser(null);
    setStatus("anonymous");
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      signIn,
      signOut,
      signUp,
    }),
    [user, status]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
