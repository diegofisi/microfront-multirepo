import React, { createContext, useEffect, useState } from "react";
import { bus } from "common-utils";

export const AppContext = createContext({
  user: null,
  theme: "light",
});

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({ name: "Cliente Joan", id: "xx123" });
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    bus.next({ topic: "appContext", payload: { user, theme } });
  }, [user, theme]);

  return (
    <AppContext.Provider value={{ user, theme, setUser, setTheme }}>
      {children}
    </AppContext.Provider>
  );
};
