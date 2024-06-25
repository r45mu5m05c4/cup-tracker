import React, {
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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<Realm.User | null>(null);
  const app = new Realm.App({ id: "data-lcjxaso" });

  useEffect(() => {
    const storedUser = sessionStorage.getItem("realmUser");
    if (storedUser) {
      const parsedUser = app.currentUser;
      setUserState(parsedUser);
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
      sessionStorage.setItem("realmUser", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("realmUser");
    }
    setUserState(user);
  };

  const logout = async () => {
    if (user) {
      await user.logOut();
      sessionStorage.removeItem("realmUser");
      const anonymousUser = await app.logIn(Realm.Credentials.anonymous());
      setUser(anonymousUser);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
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
