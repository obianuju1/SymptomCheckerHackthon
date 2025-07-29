"use client";

import React, { useState, useContext, useEffect } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User
} from "firebase/auth";
import { auth,db } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation";

// Create AuthContext
interface AuthContextType {
    user: User | null;
    signUp: (first_name: string, last_name: string, email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<User | undefined>;
    signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

// AuthProvider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    const excludedPaths = ['/auth/register', '/','/symptoms','/confirmation']; // excluded paths

    // Check if the user is signed in on mount
    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    //         if (excludedPaths.includes(pathname)) {
    //             return; // Do not redirect if on excluded paths
    //         }

    //         setUser(currentUser);
    //         if (currentUser) {
    //             router.push("/dashboard");
    //         } else {
    //             router.push("/auth/login");
    //         }
    //     });

    //     return () => unsubscribe(); // Clean up the subscription
    // }, [pathname, router]);

    // User Registration
    const signUp = async (first_name: string, last_name: string, email: string, password: string) => {
        try {
            console.log('function called')
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userDoc = doc(db, "users", user.uid);

            await setDoc(userDoc, {
                first_name,
                last_name,
                email: user.email,
                createdAt: serverTimestamp(),
            });
            console.log('added user to the database')

            setUser(user); // Update the user state
            console.log('pushing user to the dashboard....')
            router.push("/dashboard"); // Redirect after successful sign-up
        } catch (error: any) {
            console.error("SignUp Error:", error.message);
            throw new Error("Error registering user");
        }
    };

    // User Login
    const login = async (email: string, password: string) => {
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            console.log(userCredentials.user)
            setUser(userCredentials.user); // Set the logged-in user
            router.push("/dashboard"); // Redirect to dashboard after login
            return userCredentials.user;
        } catch (error: any) {
            console.error("Login Error:", error.message);
            throw new Error(error.message);
        }
    };

    // User Logout
    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setUser(null); // Reset the user state
            router.push("/login"); // Redirect to login page after sign-out
        } catch (error: any) {
            console.error("SignOut Error:", error.message);
            throw new Error("Error signing out user");
        }
    };

    return (
        <AuthContext.Provider value={{ user, signUp, login, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
