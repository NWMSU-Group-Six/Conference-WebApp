import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { ReviewRubric, Submission } from "@/models/Submission";
import type { User, UserRole } from "@/models/User";
import {
  getSubmissionsByUser,
  getAllSubmissions,
  saveReviewFeedback,
  updateSubmissionStatus,
  assignReviewer,
  unassignReviewer,
} from "@/firebase/services/submissionService";
import {
  getAllUsers,
  updateUserRole,
  getReviewers,
} from "@/firebase/services/userService";
import type { GeneralInfo } from "@/models/GeneralInfo";
import {
  getGeneralInfo,
} from "@/firebase/services/generalInfoService";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

// ─── Status badge ──────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-700",
  under_review: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const REVIEW_RUBRIC_FIELDS: Array<{
  key: keyof ReviewRubric;
  label: string;
}> = [
  { key: "originality", label: "Originality" },
  { key: "technicalQuality", label: "Technical Quality" },
  { key: "relevance", label: "Relevance" },
  { key: "clarity", label: "Clarity" },
];

const DEFAULT_REVIEW_RUBRIC: ReviewRubric = {
  originality: 3,
  technicalQuality: 3,
  relevance: 3,
  clarity: 3,
};

const normalizeReviewRubric = (
  rubric?: Partial<ReviewRubric>,
): ReviewRubric => ({
  originality: rubric?.originality ?? DEFAULT_REVIEW_RUBRIC.originality,
  technicalQuality:
    rubric?.technicalQuality ?? DEFAULT_REVIEW_RUBRIC.technicalQuality,
  relevance: rubric?.relevance ?? DEFAULT_REVIEW_RUBRIC.relevance,
  clarity: rubric?.clarity ?? DEFAULT_REVIEW_RUBRIC.clarity,
});

const getRubricTotal = (rubric: ReviewRubric): number =>
  rubric.originality +
  rubric.technicalQuality +
  rubric.relevance +
  rubric.clarity;

const getAssignedReviewerIds = (submission: Submission): string[] => {
  const ids = new Set<string>();

  if (submission.assignedReviewer) {
    ids.add(submission.assignedReviewer);
  }

  submission.assignedReviewers?.forEach((uid) => {
    if (uid) ids.add(uid);
  });

  return Array.from(ids);
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function renderField(key: string, value: any, path: string[] = []) {
  const fullPath = [...path, key].join(".");

  // Handle Firestore Timestamp
  if (value instanceof Timestamp) {
    const formatted = value.toDate().toISOString().split("T")[0];

    return (
      <div key={fullPath} className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-600">
          {key[0].toUpperCase() +
            key.slice(1).replace(/([a-z])([A-Z])/g, "$1 $2")}
        </label>
        <input
          name={fullPath}
          type="date"
          defaultValue={formatted}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm 
             focus:outline-none focus:ring-2 focus:ring-[#006a4e]"
        />
      </div>
    );
  }

  // Handle Boolean
  if (typeof value === "boolean") {
    return (
      <div key={fullPath} className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {key[0].toUpperCase() +
            key.slice(1).replace(/([a-z])([A-Z])/g, "$1 $2")}
        </label>
        <input
          name={fullPath}
          type="checkbox"
          defaultChecked={value}
          className="h-4 w-4 accent-[#006a4e]"
        />
      </div>
    );
  }

  // Handle nested object
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return (
      <div
        key={fullPath}
        className="col-span-full bg-white border border-gray-200 rounded-xl p-4 shadow-sm "
      >
        <h3 className="font-semibold text-gray-700 mb-3">
          {key[0].toUpperCase() + key.slice(1)}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(value).map(([k, v]) =>
            renderField(k, v, [...path, key]),
          )}
        </div>
      </div>
    );
  }

  // Default input
  return (
    <div key={fullPath} className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600">
        {key[0].toUpperCase() +
          key.slice(1).replace(/([a-z])([A-Z])/g, "$1 $2")}
      </label>
      <input
        name={fullPath}
        defaultValue={value ?? ""}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm 
               focus:outline-none focus:ring-2 focus:ring-[#006a4e] focus:border-[#006a4e] 
               transition-all"
      />
    </div>
  );
}

function setDeep(obj: any, path: string, value: any) {
  const keys = path.split(".");
  let current = obj;

  keys.forEach((key, i) => {
    if (i === keys.length - 1) {
      current[key] = value;
    } else {
      current[key] = current[key] || {};
      current = current[key];
    }
  });
}

const convertDates = (obj: any) => {
  for (const key in obj) {
    if (obj[key] instanceof Date) {
      obj[key] = Timestamp.fromDate(obj[key]);
    } else if (typeof obj[key] === "object") {
      convertDates(obj[key]);
    }
  }
};

const convertDateStringsToTimestamps = (obj: any): any => {
  if (obj && typeof obj === "object") {
    const result: any = {};

    for (const key in obj) {
      const value = obj[key];

      // Detect date string (YYYY-MM-DD)
      if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        result[key] = Timestamp.fromDate(new Date(`${value}T00:00:00`));
      } else if (typeof value === "object") {
        result[key] = convertDateStringsToTimestamps(value);
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  return obj;
};

// ─── User view ─────────────────────────────────────────────────────────────────
function UserView() {
  const { firebaseUser, userProfile } = useAuth();
  const [subs, setSubs] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseUser) return;
    getSubmissionsByUser(firebaseUser.uid)
      .then(setSubs)
      .finally(() => setLoading(false));
  }, [firebaseUser]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-[#006a4e]">User Dashboard</h1>
      {/* Profile card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 flex gap-5 items-center">
        <div className="w-14 h-14 rounded-full bg-[#006a4e] flex items-center justify-center text-white font-bold text-lg">
          {userProfile?.profile.firstName?.[0]}
          {userProfile?.profile.lastName?.[0]}
        </div>
        <div>
          <p className="font-bold text-gray-800 text-lg">
            {userProfile?.profile.firstName} {userProfile?.profile.lastName}
          </p>
          <p className="text-sm text-gray-500">{userProfile?.email}</p>
          {userProfile?.profile.affiliation && (
            <p className="text-sm text-gray-400">
              {userProfile.profile.affiliation}
            </p>
          )}
        </div>
        <div className="ml-auto text-right">
          {userProfile?.registration?.registered ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
              ✓ Registered
            </span>
          ) : (
            <Link
              to="/register"
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#006a4e] text-white text-sm font-medium hover:bg-[#00543d] transition-colors"
            >
              Register for Conference
            </Link>
          )}
        </div>
      </div>

      {/* Submissions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">My Submissions</h2>
          <Link
            to="/submission"
            className="px-4 py-2 bg-[#006a4e] text-white text-sm font-medium rounded-lg hover:bg-[#00543d] transition-colors"
          >
            + New Submission
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-400 py-8 text-center">Loading…</p>
        ) : subs.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-400 mb-3">No submissions yet.</p>
            <Link
              to="/submission"
              className="text-[#006a4e] font-medium underline text-sm"
            >
              Submit your first paper
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {subs.map((s) => (
              <div
                key={s.id}
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-4"
              >
                <div>
                  <p className="font-semibold text-gray-800">{s.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {s.topics?.join(", ")}
                  </p>
                </div>
                <StatusBadge status={s.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Reviewer view ─────────────────────────────────────────────────────────────
function ReviewerView() {
  const { firebaseUser } = useAuth();
  const reviewerUid = firebaseUser?.uid;
  const [subs, setSubs] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [rubricMap, setRubricMap] = useState<Record<string, ReviewRubric>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<
    Record<string, { type: "success" | "error"; text: string }>
  >({});

  useEffect(() => {
    getAllSubmissions()
      .then((all) => {
        const assigned = all.filter(
          (s) => !!reviewerUid && getAssignedReviewerIds(s).includes(reviewerUid),
        );

        setSubs(assigned);
        const initialNotes: Record<string, string> = {};
        const initialRubric: Record<string, ReviewRubric> = {};

        assigned.forEach((s) => {
          if (!s.id) return;
          const existingReview = reviewerUid
            ? s.reviewsByReviewer?.[reviewerUid]
            : undefined;

          initialNotes[s.id] = existingReview?.notes ?? s.reviewNotes ?? "";
          initialRubric[s.id] = normalizeReviewRubric(
            existingReview?.rubric ?? s.reviewRubric,
          );
        });

        setNotesMap(initialNotes);
        setRubricMap(initialRubric);
      })
      .finally(() => setLoading(false));
  }, [reviewerUid]);

  const getRubricForSubmission = (submission: Submission): ReviewRubric => {
    const existingReview = reviewerUid
      ? submission.reviewsByReviewer?.[reviewerUid]
      : undefined;

    if (!submission.id) {
      return normalizeReviewRubric(existingReview?.rubric ?? submission.reviewRubric);
    }

    return (
      rubricMap[submission.id] ??
      normalizeReviewRubric(existingReview?.rubric ?? submission.reviewRubric)
    );
  };

  const updateRubricCriterion = (
    submission: Submission,
    criterion: keyof ReviewRubric,
    value: number,
  ) => {
    if (!submission.id) return;

    const submissionId = submission.id;
    setRubricMap((prev) => ({
      ...prev,
      [submissionId]: {
        ...(prev[submissionId] ?? normalizeReviewRubric(submission.reviewRubric)),
        [criterion]: value,
      },
    }));
  };

  const saveNotes = async (id?: string) => {
    if (!id || !reviewerUid) return;

    setSaving(id);
    setSaveFeedback((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    try {
      const notes = notesMap[id] ?? "";
      const rubric = rubricMap[id] ?? DEFAULT_REVIEW_RUBRIC;
      const reviewScore = getRubricTotal(rubric);

      await saveReviewFeedback(id, reviewerUid, notes, rubric);

      setSubs((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                reviewNotes: notes,
                reviewRubric: rubric,
                reviewScore,
                reviewsByReviewer: {
                  ...(s.reviewsByReviewer ?? {}),
                  [reviewerUid]: {
                    notes,
                    rubric,
                    score: reviewScore,
                  },
                },
              }
            : s,
        ),
      );

      setSaveFeedback((prev) => ({
        ...prev,
        [id]: { type: "success", text: "Review saved." },
      }));
    } catch (error) {
      console.error("Failed to save review notes", error);
      const message =
        error instanceof Error ? error.message : "Could not save notes.";

      setSaveFeedback((prev) => ({
        ...prev,
        [id]: { type: "error", text: message },
      }));
    } finally {
      setSaving(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#006a4e] pb-3">
        Reviewer Dashboard
      </h1>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Assigned Submissions
      </h2>
      {loading ? (
        <p className="text-gray-400 py-8 text-center">Loading…</p>
      ) : subs.length === 0 ? (
        <p className="text-center text-gray-400 py-16 border border-dashed border-gray-200 rounded-2xl">
          No submissions assigned to you yet.
        </p>
      ) : (
        <div className="space-y-4">
          {subs.map((s) => {
            const rubric = getRubricForSubmission(s);
            const totalScore = getRubricTotal(rubric);

            return (
              <div
                key={s.id}
                className="bg-white border border-gray-200 rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-semibold text-gray-800">{s.title}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {s.abstract?.slice(0, 140)}…
                    </p>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
                {s.fileUrl && (
                  <a
                    href={s.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-[#006a4e] underline mb-3 inline-block"
                  >
                    View PDF ↗
                  </a>
                )}

                <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-700">
                      Rubric Scoring (1-5)
                    </p>
                    <p className="text-xs font-semibold text-[#006a4e]">
                      Total: {totalScore}/20
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {REVIEW_RUBRIC_FIELDS.map((field) => (
                      <label
                        key={field.key}
                        className="flex items-center justify-between gap-3 text-xs text-gray-700"
                      >
                        <span className="font-medium">{field.label}</span>
                        <select
                          value={rubric[field.key]}
                          onChange={(e) =>
                            updateRubricCriterion(
                              s,
                              field.key,
                              Number(e.target.value),
                            )
                          }
                          className="border border-gray-200 rounded-md px-2 py-1 text-xs focus:outline-none focus:border-[#006a4e]"
                        >
                          {[1, 2, 3, 4, 5].map((score) => (
                            <option key={score} value={score}>
                              {score}
                            </option>
                          ))}
                        </select>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Review Notes
                  </label>
                  <textarea
                    rows={3}
                    value={s.id ? (notesMap[s.id] ?? "") : (s.reviewNotes ?? "")}
                    onChange={(e) => {
                      if (!s.id) return;
                      const submissionId = s.id;
                      setNotesMap((m) => ({ ...m, [submissionId]: e.target.value }));
                    }}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#006a4e]"
                    placeholder="Enter your review notes…"
                  />
                  <button
                    onClick={() => saveNotes(s.id)}
                    disabled={saving === s.id || !s.id}
                    className="mt-2 px-4 py-1.5 bg-[#006a4e] text-white text-xs font-medium rounded-lg hover:bg-[#00543d] transition-colors disabled:opacity-60"
                  >
                    {saving === s.id ? "Saving…" : "Save Review"}
                  </button>
                  {s.id && saveFeedback[s.id] && (
                    <p
                      className={`mt-2 text-xs ${
                        saveFeedback[s.id].type === "success"
                          ? "text-green-700"
                          : "text-red-600"
                      }`}
                    >
                      {saveFeedback[s.id].text}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Admin view ────────────────────────────────────────────────────────────────
function AdminView() {
  const [users, setUsers] = useState<User[]>([]);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [reviewers, setReviewers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningSubmissionId, setAssigningSubmissionId] = useState<string | null>(null);
  const [tab, setTab] = useState<"submissions" | "users">("submissions");
  const [info, setInfo] = useState<GeneralInfo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const reload = async () => {
    const [u, s, r, i] = await Promise.all([
      getAllUsers(),
      getAllSubmissions(),
      getReviewers(),
      getGeneralInfo("2026"),
    ]);
    setUsers(u);
    setSubs(s);
    setReviewers(r);
    setInfo(i as GeneralInfo);
    setLoading(false);
  };

  useEffect(() => {
    reload();
  }, []);

  const handleRoleChange = async (uid: string, role: UserRole) => {
    const user = users.find((u) => u.uid === uid);
    if (!user) return;
    const current = user.roles ?? [];
    const updated: UserRole[] = current.includes(role)
      ? current.filter((r) => r !== role)
      : [...current, role];
    await updateUserRole(uid, updated);
    reload();
  };

  const handleToggleReviewerAssignment = async (
    subId?: string,
    reviewerUid?: string,
    shouldAssign?: boolean,
  ) => {
    if (!subId || !reviewerUid || typeof shouldAssign !== "boolean") return;

    setAssigningSubmissionId(subId);
    try {
      if (shouldAssign) {
        await assignReviewer(subId, reviewerUid);
      } else {
        await unassignReviewer(subId, reviewerUid);
      }
      await reload();
    } finally {
      setAssigningSubmissionId(null);
    }
  };

  const handleStatusChange = async (
    subId: string,
    status: Submission["status"],
  ) => {
    await updateSubmissionStatus(subId, status);
    reload();
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result: any = {};

    formData.forEach((value, key) => {
      setDeep(result, key, value === "on" ? true : value);
    });

    const inputs = e.currentTarget.querySelectorAll("input[type='checkbox']");

    inputs.forEach((input: any) => {
      const name = input.name;

      // If checkbox name NOT in FormData → it's unchecked
      if (!formData.has(name)) {
        setDeep(result, name, false);
      }
    });

    const converted = convertDateStringsToTimestamps(result);

    await updateDoc(doc(db, "generalInfo", "2026"), converted);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const FIELD_ORDER = [
    "conferenceName",
    "theme",
    "description",
    "timezone",
    "venue",
    "contact",
    "importantDates",
    "location",
    "registration",
    "links",
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#006a4e] pb-3">
        Admin Dashboard
      </h1>
      {/* Tab switcher */}
      <div className="flex gap-2 mb-6">
        {(["submissions", "users"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t
                ? "bg-[#006a4e] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#006a4e]"
              }`}
          >
            {t === "submissions" ? "All Submissions" : "All Users"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400 text-center py-12">Loading…</p>
      ) : tab === "submissions" ? (
        /* Submissions table */
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Submitted By</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Assign Reviewers</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subs.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800 max-w-xs truncate">
                      {s.title}
                    </p>
                    {s.fileUrl && (
                      <a
                        href={s.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#006a4e] underline"
                      >
                        PDF ↗
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {s.submitterEmail}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="max-h-28 overflow-y-auto pr-1 space-y-1.5">
                      {reviewers.length === 0 ? (
                        <p className="text-xs text-gray-400">No reviewers available</p>
                      ) : (
                        reviewers.map((r) => {
                          const assignedReviewerIds = getAssignedReviewerIds(s);
                          const isAssigned = assignedReviewerIds.includes(r.uid);

                          return (
                            <label
                              key={r.uid}
                              className="flex items-center gap-2 text-xs text-gray-700"
                            >
                              <input
                                type="checkbox"
                                checked={isAssigned}
                                disabled={assigningSubmissionId === s.id}
                                onChange={(e) =>
                                  handleToggleReviewerAssignment(
                                    s.id,
                                    r.uid,
                                    e.target.checked,
                                  )
                                }
                                className="h-3.5 w-3.5 accent-[#006a4e]"
                              />
                              <span>
                                {r.profile.firstName} {r.profile.lastName}
                              </span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={s.status}
                      onChange={(e) =>
                        handleStatusChange(
                          s.id!,
                          e.target.value as Submission["status"],
                        )
                      }
                      className="border border-gray-200 rounded-md px-2 py-1 text-xs focus:outline-none focus:border-[#006a4e]"
                    >
                      <option value="submitted">submitted</option>
                      <option value="under_review">under review</option>
                      <option value="accepted">accepted</option>
                      <option value="rejected">rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
              {subs.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-gray-400"
                  >
                    No submissions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Users table */
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Roles</th>
                <th className="px-4 py-3 text-left">Toggle Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.uid} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {u.profile.firstName} {u.profile.lastName}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{u.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {u.roles?.map((r) => (
                        <span
                          key={r}
                          className="px-2 py-0.5 rounded-full text-xs bg-[#e6f4ef] text-[#006a4e] font-medium"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {(["user", "reviewer", "admin"] as UserRole[]).map((role) => (
                        <button
                          key={role}
                          onClick={() => handleRoleChange(u.uid, role)}
                          className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors ${u.roles?.includes(role)
                              ? "bg-red-100 text-red-600 hover:bg-red-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                          {u.roles?.includes(role) ? `- ${role}` : `+ ${role}`}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Conference Information Table */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mt-6">
        <h2 className="text-xl font-bold text-[#006a4e]">
          Conference Information Management
        </h2>
        <p className="text-sm text-gray-500 mb-2 pb-3">
          Update conference details. Changes are saved immediately after
          clicking “Save Changes”.
        </p>
        <div className="flex flex-row gap-2">
          {info && (
            <form
              onSubmit={handleSubmit}
              onChange={() => {
                if (isSubmitted) setIsSubmitted(false);
              }}
              className="w-full max-w-4xl mx-auto flex flex-col gap-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FIELD_ORDER.map((key) => {
                  if (!(key in info)) return null;
                  return renderField(key, (info as any)[key]);
                })}
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#006a4e] text-white text-sm font-medium rounded-lg hover:bg-[#00543d] transition-colors"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>

              {isSubmitted ? (
                <p className="text-green-700 text-center">
                  Conference Info Saved ✓
                </p>
              ) : (
                <></>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard page ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { firebaseUser, userProfile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !firebaseUser) navigate("/login");
  }, [loading, firebaseUser, navigate]);

  if (loading || !firebaseUser) return null;

  const isAdmin = userProfile?.roles?.includes("admin");
  const isReviewer = userProfile?.roles?.includes("reviewer");

  const displayName = userProfile
    ? `${userProfile.profile.firstName} ${userProfile.profile.lastName}`
    : (firebaseUser.email ?? "User");

  return (
    <>
      <section className="bg-[#003d2a] text-white py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-medium text-[#a7f3d0] mb-1">
            {isAdmin ? "Admin" : isReviewer ? "Reviewer" : "User"} Dashboard
          </p>
          <h1 className="text-3xl font-bold">Welcome, {displayName}</h1>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {isAdmin && <AdminView />}
        {isAdmin && isReviewer && <hr className="border-gray-200" />}
        {isReviewer && <ReviewerView />}
        {isReviewer && <hr className="border-gray-200" />}
        <UserView />
      </div>
    </>
  );
}
