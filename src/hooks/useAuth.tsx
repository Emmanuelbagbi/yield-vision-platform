
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "researcher" | "farmer";
  avatarUrl?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo purposes
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin" as const,
    avatarUrl: "",
  },
  {
    id: "2",
    name: "Researcher",
    email: "researcher@example.com",
    password: "research123",
    role: "researcher" as const,
    avatarUrl: "",
  },
  {
    id: "3",
    name: "Farmer",
    email: "farmer@example.com",
    password: "farm123",
    role: "farmer" as const,
    avatarUrl: "",
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for session data in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Mock login authentication
      const foundUser = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) {
        throw new Error("Invalid credentials");
      }

      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      toast.success("Login successful!");
    } catch (error) {
      toast.error("Login failed: Invalid email or password");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    setIsLoading(true);
    
    try {
      // Check if user already exists
      if (MOCK_USERS.some((u) => u.email === email)) {
        throw new Error("User already exists");
      }

      // Mock user registration
      const newUser = {
        id: `${MOCK_USERS.length + 1}`,
        name,
        email,
        role: role as "admin" | "researcher" | "farmer",
        avatarUrl: "",
      };

      // In a real app, we would send this to an API
      // For demo purposes, we'll just set the user
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      toast.success("Registration successful!");
    } catch (error) {
      toast.error("Registration failed: Email already in use");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
