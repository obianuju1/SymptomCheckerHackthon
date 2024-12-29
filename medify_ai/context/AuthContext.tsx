import React,{ useState, useContext } from "react";



const AuthContext = React.createContext(null)

export function AuthProvider({children}){
    return(
        <AuthContext.Provider>

        </AuthContext.Provider>
    )
} 