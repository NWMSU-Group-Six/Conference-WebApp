import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import type { User } from "@/models/User";

export const getUser = async (uid: string): Promise<User | null> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return docSnap.data() as User;
};

export const createUser = async (user: User): Promise<void> => {
  try {
    const userRef = doc(db, "users", user.uid);

    await setDoc(userRef, {
      ...user,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log("User created successfully:", user.uid);
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
