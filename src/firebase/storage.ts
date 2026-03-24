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

export const getImage = async (path: string): Promise<string | null> => {
  try {
    const imageRef = ref(storage, path);
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    console.error("Error getting image:", error);
    return null;
  }
};
