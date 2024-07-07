import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import * as Realm from "realm-web";

interface UserContextType {
  user: Realm.User | null;
  setUser: (user: Realm.User | null) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<Realm.User | null>(null);
  const app = new Realm.App({ id: "data-lcjxaso" });

  useEffect(() => {
    const storedUserId = localStorage.getItem("realmUserId");
    if (storedUserId && app.currentUser) {
      setUserState(app.currentUser);
    } else {
      loginAnonymously();
    }
  }, []);

  const loginAnonymously = async () => {
    const user = await app.logIn(Realm.Credentials.anonymous());
    setUser(user);
  };

  const setUser = (user: Realm.User | null) => {
    if (user) {
      localStorage.setItem("realmUserId", user.id);
    } else {
      localStorage.removeItem("realmUserId");
    }
    setUserState(user);
  };

  const logout = async () => {
    if (user) {
      await user.logOut();
      localStorage.removeItem("realmUserId");
      const anonymousUser = await app.logIn(Realm.Credentials.anonymous());
      setUser(anonymousUser);
    }
  };
  const refreshAccessToken = async () => {
    try {
      if (user) {
        await user.refreshAccessToken();
        setUser(user);
      }
    } catch (error) {
      console.error("Failed to refresh access token:", error);
      // Handle token refresh failure gracefully, e.g., re-authenticate the user
      logout(); // Example: Log out user if token refresh fails
    }
  };
  return (
    <UserContext.Provider value={{ user, setUser, logout, refreshAccessToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
