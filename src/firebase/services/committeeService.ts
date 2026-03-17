import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export const getCommittee = async <Committee>(
  year: string,
): Promise<Committee | null> => {
  try {
    console.log("Fetching committee for year:", year);
    const snapshot = await getDoc(doc(db, "committees", year));

    if (!snapshot.exists()) {
      console.warn(`No committee found for ${year}`);
      return null;
    }

    console.log("Successfully fetched committee document for year:", year);
    return snapshot.data() as Committee;
  } catch (error) {
    console.error("Error fetching committee:", error);
    throw error;
  }
};
