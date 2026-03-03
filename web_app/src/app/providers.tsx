// app/providers.tsx
// Theme is permanently set to dark mode.
import { ReactNode, createContext, useContext, useState, useEffect } from "react";

interface AppContextType {
  user: null | { id: string; name: string };
  setUser: (user: AppContextType["user"]) => void;
  theme: 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<AppContextType["user"]>(null);

  // Always force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  // no-op — dark is always the theme
  const toggleTheme = () => { };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        theme: 'dark',
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
