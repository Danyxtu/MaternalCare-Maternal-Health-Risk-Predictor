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
  patientId: number | null;
  doctorId: number | null;
  first_name: string | null;
  last_name: string | null;
  middle_initial: string | null;
  email: string | null;
  age: number | null;
  contact: string | null;
  isLoading: boolean;
  login: (credentials: object) => Promise<void>;
  logout: () => void;
}

interface LoginResponse {
  token: string;
  role?: string;
  first_name?: string;
  last_name?: string;
  middle_initial?: string;
  email?: string;
  age?: number;
  contact?: string;
}

interface DecodedToken {
  role?: string;
  patientId?: number;
  doctorId?: number;
  first_name?: string;
  last_name?: string;
  middle_initial?: string;
  email?: string;
  age?: number;
  contact?: string;
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
  const [patientId, setPatientId] = useState<number | null>(null);
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [first_name, setFirstName] = useState<string | null>(null);
  const [last_name, setLastName] = useState<string | null>(null);
  const [middle_initial, setMiddleInitial] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [contact, setContact] = useState<string | null>(null);
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
          const decoded = jwtDecode<DecodedToken>(token);
          setPatientId(decoded.patientId ?? null);
          setDoctorId(decoded.doctorId ?? null);
          setFirstName(decoded.first_name ?? null);
          setLastName(decoded.last_name ?? null);
          setMiddleInitial(decoded.middle_initial ?? null);
          setEmail(decoded.email ?? null);
          setAge(decoded.age ?? null);
          setContact(decoded.contact ?? null);
          
          try {
            // Verify token with backend
            console.log("[AuthContext] Verifying session with backend...");
            const response = await axios.get(baseURL + "/auth/profile", {
              headers: { Authorization: `Bearer ${token}` }
            });
            console.log("[AuthContext] Session verified for:", response.data.user.email);
            
            const user = response.data.user;
            setFirstName(user.first_name);
            setLastName(user.last_name);
            setMiddleInitial(user.middle_initial);
            setEmail(user.email);

            if (user.role === "PATIENT" && user.patient) {
              setAge(user.patient.age);
              setContact(user.patient.contact);
            } else if (user.role === "DOCTOR" && user.doctor) {
              setContact(user.doctor.contact);
            }

            if (!storedRole) {
              storedRole = normalizeRole(user.role);
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
      const { token, first_name, last_name, middle_initial, email, age, contact } = response.data;
      const decoded = jwtDecode<DecodedToken>(token);
      const decodedRole = normalizeRole(decoded.role);
      
      if (!decodedRole) {
        throw new Error("INVALID_ROLE");
      }

      await SecureStore.setItemAsync(TOKEN_KEY, String(token));
      await SecureStore.setItemAsync(ROLE_KEY, String(decodedRole));
      
      setUserToken(token);
      setRole(decodedRole);
      setPatientId(decoded.patientId ?? null);
      setDoctorId(decoded.doctorId ?? null);
      setFirstName(first_name ?? decoded.first_name ?? null);
      setLastName(last_name ?? decoded.last_name ?? null);
      setMiddleInitial(middle_initial ?? decoded.middle_initial ?? null);
      setEmail(email ?? decoded.email ?? null);
      setAge(age ?? decoded.age ?? null);
      setContact(contact ?? decoded.contact ?? null);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(ROLE_KEY);
    setUserToken(null);
    setRole(null);
    setPatientId(null);
    setDoctorId(null);
    setFirstName(null);
    setLastName(null);
    setMiddleInitial(null);
    setEmail(null);
    setAge(null);
    setContact(null);
  };

  return (
    <AuthContext.Provider value={{ 
      userToken, 
      role, 
      patientId, 
      doctorId, 
      first_name,
      last_name,
      middle_initial,
      email,
      age,
      contact,
      isLoading, 
      login, 
      logout 
    }}>
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
