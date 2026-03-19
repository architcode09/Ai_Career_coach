import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getCurrentUser,
  signInUser,
  signOutUser,
  signUpUser,
  STORE_EVENT,
} from "@/src/services/career-service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const hydrateUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser || null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrateUser();

    const handleSessionUpdate = () => {
      hydrateUser();
    };

    window.addEventListener(STORE_EVENT, handleSessionUpdate);

    return () => {
      window.removeEventListener(STORE_EVENT, handleSessionUpdate);
    };
  }, [hydrateUser]);

  const signIn = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      const signedInUser = await signInUser(credentials);
      setUser(signedInUser || null);
      return signedInUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (payload) => {
    setIsLoading(true);
    try {
      const createdUser = await signUpUser(payload);
      setUser(createdUser || null);
      return createdUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await signOutUser();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      signIn,
      signUp,
      signOut,
    }),
    [user, isLoading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
