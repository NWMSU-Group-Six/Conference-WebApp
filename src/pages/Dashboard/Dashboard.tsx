import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { Submission } from "@/models/Submission";
import type { User, UserRole } from "@/models/User";
import {
  getSubmissionsByUser,
  getAllSubmissions,
  addReviewNotes,
  updateSubmissionStatus,
  assignReviewer,
} from "@/firebase/services/submissionService";
import {
  getAllUsers,
  updateUserRole,
  getReviewers,
} from "@/firebase/services/userService";
import type { GeneralInfo } from "@/models/GeneralInfo";
import { getGeneralInfo } from "@/firebase/services/generalInfoService";

// ─── Status badge ──────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-700",
  under_review: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
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

// ─── Author view ───────────────────────────────────────────────────────────────
function AuthorView() {
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
      <h1 className="text-3xl font-bold text-[#006a4e]">Author Dashboard</h1>
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
  const [subs, setSubs] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    getAllSubmissions()
      .then((all) =>
        setSubs(all.filter((s) => s.assignedReviewer === firebaseUser?.uid)),
      )
      .finally(() => setLoading(false));
  }, [firebaseUser]);

  const saveNotes = async (id: string) => {
    setSaving(id);
    await addReviewNotes(id, notesMap[id] ?? "");
    setSaving(null);
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
          {subs.map((s) => (
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
              <div className="mt-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Review Notes
                </label>
                <textarea
                  rows={3}
                  defaultValue={s.reviewNotes ?? ""}
                  onChange={(e) =>
                    setNotesMap((m) => ({ ...m, [s.id!]: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#006a4e]"
                  placeholder="Enter your review notes…"
                />
                <button
                  onClick={() => saveNotes(s.id!)}
                  disabled={saving === s.id}
                  className="mt-2 px-4 py-1.5 bg-[#006a4e] text-white text-xs font-medium rounded-lg hover:bg-[#00543d] transition-colors disabled:opacity-60"
                >
                  {saving === s.id ? "Saving…" : "Save Notes"}
                </button>
              </div>
            </div>
          ))}
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
  const [tab, setTab] = useState<"submissions" | "users">("submissions");
  const [info, setInfo] = useState<GeneralInfo | null>(null);
  const [title, setTitle] = useState<string>("");

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

  const handleAssignReviewer = async (subId: string, reviewerUid: string) => {
    if (!reviewerUid) return;
    await assignReviewer(subId, reviewerUid);
    reload();
  };

  const handleStatusChange = async (
    subId: string,
    status: Submission["status"],
  ) => {
    await updateSubmissionStatus(subId, status);
    reload();
  };

  function conferenceManagementSubmit(formData) {
    const title = formData.get("title");
    alert(`Your title is '${title}'`);
  }

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
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t
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
                <th className="px-4 py-3 text-left">Assign Reviewer</th>
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
                    <select
                      defaultValue={s.assignedReviewer ?? ""}
                      onChange={(e) =>
                        handleAssignReviewer(s.id!, e.target.value)
                      }
                      className="border border-gray-200 rounded-md px-2 py-1 text-xs focus:outline-none focus:border-[#006a4e]"
                    >
                      <option value="">— assign reviewer —</option>
                      {reviewers.map((r) => (
                        <option key={r.uid} value={r.uid}>
                          {r.profile.firstName} {r.profile.lastName}
                        </option>
                      ))}
                    </select>
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
                    <div className="flex gap-1.5">
                      {(["reviewer", "admin"] as UserRole[]).map((role) => (
                        <button
                          key={role}
                          onClick={() => handleRoleChange(u.uid, role)}
                          className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                            u.roles?.includes(role)
                              ? "bg-[#006a4e] text-white border-[#006a4e]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-[#006a4e]"
                          }`}
                        >
                          {u.roles?.includes(role) ? `✓ ${role}` : `+ ${role}`}
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
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden p-3 mt-5">
        <h2 className="text-xl font-bold text-[#006a4e] pb-3">
          Conference Information Management
        </h2>
        <div className="flex flex-row gap-2">
          <form action={conferenceManagementSubmit}>
            <label className="px-4 py-3 font-medium text-gray-800">
              Conference Title:
            </label>
            <input
              type="text"
              name="title"
              className="border border-gray-200 rounded-md p-1"
            ></input>
            <button type="submit">Submit</button>
          </form>
          <p className="px-4 py-3 font-medium text-gray-800">{title}</p>
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
            {isAdmin ? "Admin" : isReviewer ? "Reviewer" : "Author"} Dashboard
          </p>
          <h1 className="text-3xl font-bold">Welcome, {displayName}</h1>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {isAdmin && <AdminView />}
        {isAdmin && isReviewer && <hr className="border-gray-200" />}
        {isReviewer && <ReviewerView />}
        {isReviewer && <hr className="border-gray-200" />}
        <AuthorView />
      </div>
    </>
  );
}
