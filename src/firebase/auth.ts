import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { createUser } from "./services/userService";

export const signup = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) => {
  await setPersistence(auth, browserLocalPersistence);
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const { uid } = credential.user;

  await createUser({
    uid,
    email,
    profile: { firstName, lastName },
    roles: ["user"],
    createdAt: new Date(),
  });

  return credential.user;
};

export const login = async (email: string, password: string) => {
  await setPersistence(auth, browserLocalPersistence);
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};
