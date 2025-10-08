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
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

// Create AuthContext
interface AppUser {
    // Firebase Auth properties
    uid?: string;
    email?: string | null;
    displayName?: string | null;
    photoURL?: string | null;
    
    // Custom Firestore properties
    first_name?: string;
    last_name?: string;
    createdAt?: unknown;
}

interface AuthContextType {
    user: AppUser | null;
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
    const [user, setUser] = useState<AppUser | null>(null);
    const router = useRouter();

    // Check if the user is signed in on mount
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                await fetchAndMergeUserData(currentUser);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe(); // Clean up the subscription
    }, []);

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

            await fetchAndMergeUserData(user); // Fetch and merge user data
            console.log('pushing user to the dashboard....')
            router.push("/home"); // Redirect after successful sign-up
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Error registering user";
            console.error("SignUp Error:", errorMessage);
            throw new Error("Error registering user");
        }
    };

    // Fetch user data from Firestore and merge with Firebase user
    const fetchAndMergeUserData = async (firebaseUser: User) => {
        try {
            console.log('Fetching user data for userId:', firebaseUser.uid);
            const userDoc = doc(db, "users", firebaseUser.uid);
            const userSnap = await getDoc(userDoc);
            console.log('User document exists:', userSnap.exists());
            
            // Start with Firebase user data
            const appUser: AppUser = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL
            };
            
            if (userSnap.exists()) {
                const firestoreData = userSnap.data();
                console.log('User data from Firestore:', firestoreData);
                
                // Add Firestore data
                appUser.first_name = firestoreData.first_name;
                appUser.last_name = firestoreData.last_name;
                appUser.createdAt = firestoreData.createdAt;
            } else {
                console.log('No user document found in Firestore');
            }
            
            setUser(appUser);
        } catch (error) {
            console.error("Error fetching user data:", error);
            // Fallback to just Firebase data
            setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL
            });
        }
    };

    // User Login
    const login = async (email: string, password: string) => {
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            console.log(userCredentials.user)
            await fetchAndMergeUserData(userCredentials.user); // Fetch and merge user data
            router.push("/home"); // Redirect to dashboard after login
            return userCredentials.user;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Login failed";
            console.error("Login Error:", errorMessage);
            throw new Error(errorMessage);
        }
    };

    // User Logout
    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setUser(null); // Reset the user state
            router.push("/login"); // Redirect to login page after sign-out
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Error signing out user";
            console.error("SignOut Error:", errorMessage);
            throw new Error("Error signing out user");
        }
    };

    return (
        <AuthContext.Provider value={{ user, signUp, login, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
