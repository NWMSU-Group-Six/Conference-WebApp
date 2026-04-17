import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export const getGeneralInfo = async <GeneralInfo>(
  year: string,
): Promise<GeneralInfo | null> => {
  try {
    console.log("Fetching general info for year:", year);
    const snapshot = await getDoc(doc(db, "generalInfo", year));

    if (!snapshot.exists()) {
      console.warn(`No information found for ${year}`);
      return null;
    }

    console.log("Successfully fetched general info document for year:", year);
    return snapshot.data() as GeneralInfo;
  } catch (error) {
    console.error("Error fetching general info:", error);
    throw error;
  }
};

export const modifyValue = async (
  collection: string,
  documentId: string,
  key: string,
  value: string,
): Promise<void> => {
  await updateDoc(doc(db, collection, documentId), {
    [key]: value,
  });
};
