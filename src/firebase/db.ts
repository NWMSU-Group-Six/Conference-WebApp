// Firebase database logic
import { getDocs, doc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";

export const getDataByCollection = async <T>(
  collectionName: string,
): Promise<T[]> => {
  try {
    console.log("Fetching collection:", collectionName);
    const querySnapshot = await getDocs(collection(db, collectionName));
    console.log(
      `Successfully fetched ${querySnapshot.size} documents from ${collectionName}`,
    );

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  } catch (error) {
    console.error(`Error fetching ${collectionName} data: `, error);
    throw error;
  }
};

export async function saveDocument(
  collectionName: string,
  data: any,
  id?: string,
  merge: boolean = true,
) {
  try {
    if (id) {
      // Save with specific document ID
      const docRef = doc(db, collectionName, id);
      await setDoc(docRef, data, { merge });
      return id;
    } else {
      // Auto-generate document ID
      const colRef = collection(db, collectionName);
      const docRef = await addDoc(colRef, data);
      return docRef.id;
    }
  } catch (error) {
    console.error("Error saving document:", error);
    throw error;
  }
}
