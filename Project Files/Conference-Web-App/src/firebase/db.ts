// Firebase database logic
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { app } from "./firebase";

const db = getFirestore(app);
