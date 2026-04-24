import React, { createContext, useState, useEffect, useContext } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

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

const PORT = 3000;
const HOST_URL = process.env.EXPO_PUBLIC_BASE_URL || "http://10.32.88.104";
const hosturl = HOST_URL + ":" + PORT;
const baseURL = hosturl + "/api";

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

        if (token && !storedRole) {
          storedRole = decodeRoleFromToken(token);
        }
      } catch (e) {
        console.log("Restoring token/role failed", e);
      }
      setUserToken(token);
      setRole(storedRole);
      setIsLoading(false);
    };

    bootstrapAsync();
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
