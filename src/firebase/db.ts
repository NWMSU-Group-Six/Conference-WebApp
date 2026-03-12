// Firebase database logic
import { getDocs, collection } from "firebase/firestore";
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
