import { storage } from "@/firebase/firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";

export const getAllImages = async (folderPath: string) => {
  try {
    const folderRef = ref(storage, folderPath);

    // Get all items in folder
    const result = await listAll(folderRef);

    // Convert each file to a downloadable URL
    const urls = await Promise.all(
      result.items.map((itemRef) => getDownloadURL(itemRef)),
    );

    return urls;
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
};
