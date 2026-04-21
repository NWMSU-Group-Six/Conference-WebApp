import type { Timestamp } from "firebase/firestore";

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

export type ReviewRubric = {
  originality: number;
  technicalQuality: number;
  relevance: number;
  clarity: number;
};

export type SubmissionReview = {
  notes: string;
  rubric: ReviewRubric;
  score: number;
  reviewedAt?: Timestamp;
};

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
  submittedAt?: Timestamp;
  /** Legacy single reviewer field kept for backward compatibility. */
  assignedReviewer?: string;
  /** Current reviewer assignment model (supports multiple reviewers). */
  assignedReviewers?: string[];
  reviewNotes?: string;
  reviewRubric?: ReviewRubric;
  reviewScore?: number;
  reviewedAt?: Timestamp;
  /** Per-reviewer saved feedback keyed by reviewer uid. */
  reviewsByReviewer?: Record<string, SubmissionReview>;
};
