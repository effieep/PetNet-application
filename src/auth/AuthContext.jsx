import React from "react";
import { API_URL } from "../api";
import { useNavigate } from 'react-router-dom';

const AuthContext = React.createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const isLoggedIn = !!user;

  // Restore session after refresh
  React.useEffect(() => {
    const saved = localStorage.getItem("auth_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const signup = async ( formData ) => {
    const existingRes = await fetch(`${API_URL}/users?email=${encodeURIComponent(formData.contact.email)}`);
    const existing = await existingRes.json();
    if (existing.length > 0) throw new Error("Email already exists");
    if( formData.userType === 'owner'){
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData.personal,
          ...formData.contact,
          ...formData.address,
          password: formData.auth.password,
          role: formData.userType,
        })
      });

      if (!res.ok) throw new Error("Signup failed");
      const savedUser = await res.json();

      setUser(savedUser);
      localStorage.setItem("auth_user", JSON.stringify(savedUser));
      return savedUser;
    } else {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profilePic: null,
          oldProfilePic: null,
          ...formData.personal,
          ...formData.contact,
          ...formData.address,
          password: formData.auth.password,
          ...formData.vet,
          role: formData.userType,
          jobs: null,
          services: {
            general: true,
            vacinations: false,
            nutrition: false,
            consulting: false
          },
          diagnostics: {
            blood: false,
            xrays: false,
            odontology: false,
            other: false
          },
          surgeries: {
            general: false,
            castration: false,
            emergency: false
          },
          reviews: []

        })
      });

      if (!res.ok) throw new Error("Signup failed");
      const savedUser = await res.json();

      setUser(savedUser);
      localStorage.setItem("auth_user", JSON.stringify(savedUser));
      return savedUser;
      
    }
    
  };

  const login = async ({ email, password }) => {
    if (!email || !password) {
      throw new Error("Παρακαλώ συμπληρώστε όλα τα πεδία.");
    }
    const res = await fetch(
      `${API_URL}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    );
    if (!res.ok) throw new Error("Login failed");

    const users = await res.json();
    if (users.length !== 1) throw new Error("Λάθος στοιχεία σύνδεσης.");

    setUser(users[0]);
    localStorage.setItem("auth_user", JSON.stringify(users[0]));
    return users[0];
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    navigate("/");
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
