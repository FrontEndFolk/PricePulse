// AppContext.js
import React, { createContext, useEffect, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/user/current", { credentials: "include" })
            .then(res => res.json())
            .then(data => setUser(data));
    }, [])

    console.log("app provider:" + user);

    return (
        <AppContext.Provider value={{ user, setUser }}>
            {children}
        </AppContext.Provider>
    );
};

