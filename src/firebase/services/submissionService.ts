import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Submission } from "@/models/Submission";

const COL = "submissions";
const USER_COL = "users";

/** Create a new submission document. Returns the new document id. */
export const createSubmission = async (
  data: Omit<Submission, "id" | "submittedAt">,
): Promise<string> => {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    submittedAt: serverTimestamp(),
  });
  return ref.id;
};

/** Get all submissions by a specific user uid. */
export const getSubmissionsByUser = async (uid: string): Promise<Submission[]> => {
  const q = query(collection(db, COL), where("submittedBy", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Submission));
};

/** Get every submission (admin/reviewer use). */
export const getAllSubmissions = async (): Promise<Submission[]> => {
  const snap = await getDocs(collection(db, COL));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Submission));
};

/** Assign a reviewer uid to a submission. */
export const assignReviewer = async (
  submissionId: string,
  reviewerUid: string,
): Promise<void> => {
  await updateDoc(doc(db, COL, submissionId), {
    assignedReviewer: reviewerUid,
    status: "under_review",
  });
};

/** Add / update review notes on a submission. */
export const addReviewNotes = async (
  submissionId: string,
  notes: string,
): Promise<void> => {
  await updateDoc(doc(db, COL, submissionId), { reviewNotes: notes });
};

/** Update the status of a submission (accept/reject/etc.). */
export const updateSubmissionStatus = async (
  submissionId: string,
  status: Submission["status"],
): Promise<void> => {
  await updateDoc(doc(db, COL, submissionId), { status });
};
