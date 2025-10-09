
"use client";

import { APP_CONFIG } from "@/lib/config";
import React, { createContext, useContext, useEffect, useState } from "react";

type UserContextType = {
    currentUser: string;
    setCurrentUser: (user: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            try {
                const storedUser = localStorage.getItem("currentUser");
                return storedUser || APP_CONFIG.users[0];
            } catch (error) {
                console.warn("Failed to read from localStorage", error);
            }
        }
        return APP_CONFIG.users[0];
    });

    useEffect(() => {
        try {
            localStorage.setItem("currentUser", currentUser);
        } catch (error) {
            console.warn("Failed to write to localStorage", error);
        }
    }, [currentUser]);

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
