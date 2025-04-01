import React, { createContext, useContext, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db, googleProvider } from "@/firebase";

interface AuthContextType {
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}
// creating the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // For signUp function:
  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        uid: userCredential.user.uid,
      });

      // Store user data in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          token,
          uid: userCredential.user.uid,
          email: userCredential.user.email,
        })
      );

      navigate("/chat");
    } catch (error) {
      console.error("Something went wrong:", error);
    } finally {
      setLoading(false);
    }
  };

  // For signIn function:
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();

      // Store user data in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          token,
          uid: userCredential.user.uid,
          email: userCredential.user.email,
        })
      );

      navigate("/chat");
    } catch (error) {
      console.error("Something went Wrong :", error);
    } finally {
      setLoading(false);
    }
  };

  // For signInWithGoogle function:
  const signInWithGoogle = async () => {
    try {
      setLoading(true);

      const userCredential = await signInWithPopup(auth, googleProvider);
      const token = await userCredential.user.getIdToken();

      // Get user directly from userCredential
      const user = userCredential.user;

      await setDoc(
        doc(db, "users", user.uid),
        { email: user.email, uid: user.uid },
        { merge: true }
      );

      // Store user data in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          token,
          uid: user.uid,
          email: user.email,
        })
      );

      navigate("/chat");

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // For logout function:
  const logout = async () => {
    try {
      await signOut(auth);
      // Remove user data from localStorage
      localStorage.removeItem("user");
      alert("Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ loading, signUp, signIn, signInWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
