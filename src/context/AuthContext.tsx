import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { getUser } from "@/firebase/services/userService";
import type { User } from "@/models/User";

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  firebaseUser: null,
  userProfile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (uid: string) => {
    try {
      const profile = await getUser(uid);
      setUserProfile(profile);
    } catch {
      setUserProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (firebaseUser) {
      await loadProfile(firebaseUser.uid);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        await loadProfile(fbUser.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
    setFirebaseUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{ firebaseUser, userProfile, loading, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
