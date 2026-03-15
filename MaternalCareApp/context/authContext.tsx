import React, { createContext, useState, useEffect, useContext } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

// 1. Define the shape of our context
interface AuthContextType {
  userToken: string | null;
  isLoading: boolean;
  login: (credentials: object) => Promise<void>;
  logout: () => void;
}

const PORT = 3000;
const hosturl = "http://172.19.232.104:" + PORT;
const baseURL = hosturl + "/api";

axios.defaults.baseURL = baseURL;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Check for token on app startup (Persistence)
  useEffect(() => {
    const bootstrapAsync = async () => {
      let token = null;
      try {
        token = await SecureStore.getItemAsync("userToken");
      } catch (e) {
        console.log("Restoring token failed", e);
      }
      setUserToken(token);
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  const login = async (credentials: object) => {
    try {
      const response = await axios.post(baseURL + "/auth/login", credentials);
      const { token } = response.data;

      await SecureStore.setItemAsync("userToken", token);
      setUserToken(token);
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("userToken");
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, isLoading, login, logout }}>
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
