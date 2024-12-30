"use client"

import React, { useState, useContext, useEffect } from "react";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut as firebaseSignOut, 
    onAuthStateChanged 
} from "firebase/auth";
import { auth, db } from "../src/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation"; // Import useRouter for redirection in Next.js
import { Router } from "express";

// Create AuthContext
const AuthContext = React.createContext<any>(null);

export const useAuth = () => useContext(AuthContext);

// AuthProvider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const router = useRouter(); // Access the useRouter hook for navigation
    const pathname = usePathname()
    const excludedPaths = ['/auth/register', '/']

    // Check if the user is signed in on mount
    useEffect(() => {
        if (router) { // Check if router exists
            const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                if (excludedPaths.includes(pathname)){
                    return
                }


                setUser(currentUser);
                if (currentUser) {
                    router.push("/dashboard"); 
                } else {
                    router.push("/auth/login"); 
                }
            });
    
            return unsubscribe;
        }
    }, [router]);

    // User Registration
    const signUp = async (
        first_name: string, 
        last_name: string, 
        email: string, 
        password: string
    ) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userDoc = doc(db, "users", user.uid);

            await setDoc(userDoc, {
                first_name,
                last_name,
                email: user.email,
                createdAt: serverTimestamp(),
            });

            setUser(user); // Update the user state
            router.push("/dashboard"); // Redirect after successful sign-up
        } catch (error: any) {
            console.error(error.message);
            throw new Error("Error registering user");
        }
    };

    // User Login
    const login = async (email: string, password: string) => {
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredentials.user); // Set the logged-in user
            router.push("/dashboard"); // Redirect to dashboard after login
            return userCredentials.user;
        } catch (error: any) {
            console.error(error.message);
            throw new Error("Error logging in user");
        }
    };

    // User Logout
    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setUser(null); // Reset the user state
            router.push("/login"); // Redirect to login page after sign-out
        } catch (error: any) {
            console.error(error.message);
            throw new Error("Error signing out user");
        }
    };

    return (
        <AuthContext.Provider value={{ user, signUp, login, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
