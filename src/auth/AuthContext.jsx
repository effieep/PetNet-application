import React from "react";
import { API_URL } from "../api";

const AuthContext = React.createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const isLoggedIn = !!user;

  // Restore session after refresh
  React.useEffect(() => {
    const saved = localStorage.getItem("auth_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const signup = async ({ name, email, password, role }) => {
    // Optional: prevent duplicate emails
    const existingRes = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`);
    const existing = await existingRes.json();
    if (existing.length > 0) throw new Error("Email already exists");

    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (!res.ok) throw new Error("Signup failed");
    const savedUser = await res.json();

    setUser(savedUser);
    localStorage.setItem("auth_user", JSON.stringify(savedUser));
    return savedUser;
  };

  const login = async ({ email, password }) => {
    const res = await fetch(
      `${API_URL}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    );
    if (!res.ok) throw new Error("Login failed");

    const users = await res.json();
    if (users.length !== 1) throw new Error("Invalid credentials");

    setUser(users[0]);
    localStorage.setItem("auth_user", JSON.stringify(users[0]));
    return users[0];
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
