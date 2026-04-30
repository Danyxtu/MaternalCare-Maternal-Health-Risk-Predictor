import React, { createContext, useState, useEffect, useContext } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { authEvents } from "../utils/eventEmitter";

// --- Types ---
type UserRole = "DOCTOR" | "PATIENT";

interface AuthContextType {
  userToken: string | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (credentials: object) => Promise<void>;
  logout: () => void;
}

interface LoginResponse {
  token: string;
  role?: string;
}

interface DecodedToken {
  role?: string;
}

const TOKEN_KEY = "userToken";
const ROLE_KEY = "userRole";

const baseURL = (process.env.EXPO_PUBLIC_BASE_URL ? process.env.EXPO_PUBLIC_BASE_URL + ":3000" : "http://localhost:3000") + "/api";

axios.defaults.baseURL = baseURL;

const normalizeRole = (role?: string | null): UserRole | null => {
  if (!role) return null;
  const upper = role.toUpperCase();
  if (upper === "DOCTOR" || upper === "PATIENT") return upper;
  return null;
};

const decodeRoleFromToken = (token: string): UserRole | null => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return normalizeRole(decoded?.role ?? null);
  } catch (error) {
    console.log("Failed to decode token role", error);
    return null;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Check for token on app startup (Persistence)
  useEffect(() => {
    const bootstrapAsync = async () => {
      let token: string | null = null;
      let storedRole: UserRole | null = null;
      try {
        token = await SecureStore.getItemAsync(TOKEN_KEY);
        const persistedRole = await SecureStore.getItemAsync(ROLE_KEY);
        storedRole = normalizeRole(persistedRole);

        if (token) {
          try {
            // Verify token with backend
            console.log("[AuthContext] Verifying session with backend...");
            const response = await axios.get(baseURL + "/auth/profile", {
              headers: { Authorization: `Bearer ${token}` }
            });
            console.log("[AuthContext] Session verified for:", response.data.user.email);
            
            if (!storedRole) {
              storedRole = normalizeRole(response.data.user.role);
            }
          } catch (verifyError: any) {
            console.warn("[AuthContext] Token verification failed. Clearing session.", verifyError.message);
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            await SecureStore.deleteItemAsync(ROLE_KEY);
            token = null;
            storedRole = null;
          }
        }
      } catch (e) {
        console.log("Restoring token/role failed", e);
      }
      setUserToken(token);
      setRole(storedRole);
      setIsLoading(false);
    };

    bootstrapAsync();

    // Listen for session expiration events from API interceptor
    const unsubscribe = authEvents.on("onSessionExpired", () => {
      console.log("Session expired event received. Logging out...");
      logout();
    });

    return () => unsubscribe();
  }, []);

  const login = async (credentials: object) => {
    try {
      const response = await axios.post<LoginResponse>(
        baseURL + "/auth/login",
        credentials,
      );
      const { token } = response.data ?? response.data;
      console.log("LOGIN RESPONSE:", response.data);
      console.log("TOKEN:", token);
      const decodedRole = decodeRoleFromToken(token);
      
      if (decodedRole !== "DOCTOR") {
        throw new Error("ONLY_DOCTORS_ALLOWED");
      }

      const effectiveRole = decodedRole;

      await SecureStore.setItemAsync(TOKEN_KEY, String(token));
      if (effectiveRole) {
        await SecureStore.setItemAsync(ROLE_KEY, String(effectiveRole));
      }
      setUserToken(token);
      setRole(effectiveRole);
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(ROLE_KEY);
    setUserToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, role, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
