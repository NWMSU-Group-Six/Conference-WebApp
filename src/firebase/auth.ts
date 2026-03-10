// Authorization and authentication logic using Firebase Authentication
// Authorization and authentication logic using Firebase Authentication
import { getAuth } from "firebase/auth";
import { app } from "./firebase";
// auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth(app);
