"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, User } from "firebase/auth";
import { auth, googleProvider } from "@/lib/service";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety timeout to ensure loader doesn't hang forever
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn("Auth initialization timed out. Forcing loader close.");
        setLoading(false);
      }
    }, 8000);

    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("Redirect sign-in successful:", result.user.email);
          setUser(result.user);
          toast.success("Welcome back, " + (result.user.displayName || result.user.email));
        }
      })
      .catch((error) => {
        console.error("Redirect result error:", error);
        if (error.code === 'auth/unauthorized-domain') {
          toast.error("Domain Unauthorized", {
            description: "This domain is not authorized in Firebase. Check Firebase Console > Auth > Settings > Authorized Domains."
          });
        } else if (error.code !== 'auth/popup-closed-by-user') {
          toast.error("Auth Error", { description: error.message });
        }
      });

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      console.log("Auth state changed:", u ? u.email : "No user");
      setUser(u);
      setLoading(false);
      clearTimeout(timeout);
    }, (error) => {
      console.error("Auth state observer error:", error);
      setLoading(false);
      clearTimeout(timeout);
    });
    
    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const login = async (email?: string, password?: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "unknown";
    console.log("Initiating login from origin:", origin);
    
    try {
      if (email && password) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Try popup first
        try {
          await signInWithPopup(auth, googleProvider);
        } catch (popupError: any) {
          console.log("Popup failed, checking if redirect is needed:", popupError.code);
          
          // If popup is blocked or domain is unauthorized, try redirect as fallback
          if (
            popupError.code === 'auth/unauthorized-domain' || 
            popupError.code === 'auth/popup-blocked' ||
            popupError.code === 'auth/cancelled-popup-request'
          ) {
            console.log("Attempting redirect fallback...");
            await signInWithRedirect(auth, googleProvider);
            return;
          }
          throw popupError;
        }
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      
      let message = "Authentication Failed";
      let description = error.message;

      if (error.code === 'auth/unauthorized-domain') {
        description = `Domain "${origin}" is not authorized. Add it in Firebase Console > Authentication > Settings.`;
      } else if (error.code === 'auth/popup-closed-by-user') {
        return; // Ignore user cancellations
      }

      toast.error(message, { description });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider. Check if layout.tsx correctly wraps children.");
  }
  return context;
}