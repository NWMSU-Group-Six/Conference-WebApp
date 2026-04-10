export type SubmissionStatus =
  | "submitted"
  | "under_review"
  | "accepted"
  | "rejected";

export type SubmissionAuthor = {
  name: string;
  email: string;
  affiliation: string;
};
export type SubmissionRatings = Record<string, number>;

export type Submission = {
  id?: string;
  title: string;
  abstract: string;
  keywords: string;
  topics: string[];
  authors: SubmissionAuthor[];
  /** Firebase Storage download URL */
  fileUrl?: string;
  /** Firebase Storage path for deletion */
  filePath?: string;
  status: SubmissionStatus;
  /** uid of the submitting user */
  submittedBy: string;
  submitterEmail: string;
  submittedAt?: Date;
  assignedReviewer?: string;
  reviewNotes?: string;
};
