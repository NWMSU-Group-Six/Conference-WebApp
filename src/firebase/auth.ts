// Authorization and authentication logic using Firebase Authentication
import { auth } from "./firebase";
// auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

export const signup = async (email: string, password: string) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    console.log("User registered successfully");
  } catch (err) {
    console.log("Login error: ", err);
    throw err;
  }
};

export const login = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in successfully");
  } catch (err) {
    console.log("Login error: ", err);
    throw err;
  }
};
