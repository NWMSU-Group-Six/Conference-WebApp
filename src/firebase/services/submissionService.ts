import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
  increment,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Submission } from "@/models/Submission";
import type { User } from "@/models/User";

const COL = "submissions";
const USER_COL = "users";

const pickReviewerForSubmission = async (
  submission: Omit<Submission, "id" | "submittedAt">,
): Promise<string | null> => {
  const reviewersQuery = query(
    collection(db, USER_COL),
    where("roles", "array-contains", "reviewer"),
  );

  const snap = await getDocs(reviewersQuery);

  const reviewers = snap.docs
    .map((d) => {
      const data = d.data() as Omit<User, "uid"> & {
        currentAssignments?: number;
      };

      return {
        ...data,
        uid: d.id,
      };
    })
    .filter((r) => r.roles.includes("reviewer"))
    .filter((r) => r.uid !== submission.submittedBy);

  if (reviewers.length === 0) return null;

  const minLoad = Math.min(
    ...reviewers.map((r) => r.currentAssignments ?? 0),
  );

  const leastLoaded = reviewers.filter(
    (r) => (r.currentAssignments ?? 0) === minLoad,
  );

  const selected =
    leastLoaded[Math.floor(Math.random() * leastLoaded.length)];

  return selected.uid;
};

/** Create a new submission document. Returns the new document id. */
export const createSubmission = async (
  data: Omit<Submission, "id" | "submittedAt">,
): Promise<string> => {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    submittedAt: serverTimestamp(),
  });

  const reviewerUid = await pickReviewerForSubmission(data);

  if (reviewerUid) {
    await updateDoc(doc(db, COL, ref.id), {
      assignedReviewer: reviewerUid,
      status: "under_review",
    });

    await updateDoc(doc(db, USER_COL, reviewerUid), {
      currentAssignments: increment(1),
    });
  }

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
  newReviewerUid: string,
): Promise<void> => {
  const submissionRef = doc(db, COL, submissionId);

  // 1. Fetch current submission
  const submissionSnap = await getDoc(submissionRef);

  if (submissionSnap.exists()) {
    const submissionData = submissionSnap.data();
    const oldReviewerUid = submissionData?.assignedReviewer;

    // 2. Decrement old reviewer if different
    if (oldReviewerUid && oldReviewerUid !== newReviewerUid) {
      await updateDoc(doc(db, USER_COL, oldReviewerUid), {
        currentAssignments: increment(-1),
      });
    }
  }

  // 3. Assign new reviewer
  await updateDoc(submissionRef, {
    assignedReviewer: newReviewerUid,
    status: "under_review",
  });

  // 4. Increment new reviewer
  await updateDoc(doc(db, USER_COL, newReviewerUid), {
    currentAssignments: increment(1),
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
