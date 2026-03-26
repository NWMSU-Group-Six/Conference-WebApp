import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import type { User, UserRole } from "@/models/User";

export const getUser = async (uid: string): Promise<User | null> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return docSnap.data() as User;
};

export const createUser = async (user: Omit<User, "createdAt"> & { createdAt: Date }): Promise<void> => {
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    ...user,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const registerForConference = async (
  uid: string,
  ticketType: string
): Promise<void> => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    "registration.registered": true,
    "registration.ticketType": ticketType,
    "registration.paymentStatus": "pending",
    "registration.registeredAt": serverTimestamp(),
  });
};

export const getReviewers = async (): Promise<User[]> => {
  const q = query(
    collection(db, "users"),
    where("roles", "array-contains", "reviewer")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as User);
};

/** Get every user document (admin use only). */
export const getAllUsers = async (): Promise<User[]> => {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((d) => d.data() as User);
};

/** Replace the roles array on a user document. */
export const updateUserRole = async (
  uid: string,
  roles: UserRole[]
): Promise<void> => {
  await updateDoc(doc(db, "users", uid), { roles });
};

