import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { uploadFile } from "@/firebase/storage";
import { createSubmission } from "@/firebase/services/submissionService";
import type { SubmissionAuthor } from "@/models/Submission";
import styles from "./Submission.module.css";
import Hero from "@/components/custom/Hero";
import { getGeneralInfo } from "@/firebase/services/generalInfoService";
import type { GeneralInfo } from "@/models/GeneralInfo";

const TOPICS = [
  "Artificial Intelligence",
  "Data Science & Analytics",
  "Computer Networks",
  "Cybersecurity",
  "Software Engineering",
  "Human-Computer Interaction",
  "Databases",
  "Other",
];

const emptyAuthor = (): SubmissionAuthor => ({
  name: "",
  email: "",
  affiliation: "",
});

export default function Submission() {
  const { firebaseUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [keywords, setKeywords] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [authors, setAuthors] = useState<SubmissionAuthor[]>([emptyAuthor()]);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [info, setInfo] = useState<GeneralInfo | null>();

  useEffect(() => {
    const fetchInfo = async () => {
      const data = await getGeneralInfo<GeneralInfo>("2026");
      setInfo(data);
    };
    fetchInfo();
  }, []);

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!firebaseUser) {
    return (
      <>
        <Hero
          title="Paper Submission"
          subtitle={`Submit your full paper (PDF) for  ${info?.conferenceName}`}
        />

        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-lg text-gray-600">
            You must be signed in to submit a paper.
          </p>
          <Link
            to="/login"
            className="px-6 py-2.5 bg-[#006a4e] text-white rounded-lg font-medium hover:bg-[#00543d] transition-colors"
          >
            Sign In
          </Link>
        </div>
      </>
    );
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <>
        <Hero
          title="Paper Submission"
          subtitle={`Submit your full paper (PDF) for  ${info?.conferenceName}`}
        />

        <div className="flex flex-col items-center justify-center py-24 gap-5 max-w-lg mx-auto text-center px-6">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Submission Received
          </h2>
          <p className="text-gray-500">
            Your paper has been submitted successfully. You can track its status
            from your&nbsp;
            <Link to="/dashboard" className="text-[#006a4e] underline">
              Dashboard
            </Link>
            .
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2.5 bg-[#006a4e] text-white rounded-lg font-medium hover:bg-[#00543d] transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </>
    );
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  };

  const updateAuthor = (
    index: number,
    field: keyof SubmissionAuthor,
    value: string,
  ) => {
    setAuthors((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [field]: value } : a)),
    );
  };

  const addAuthor = () => setAuthors((prev) => [...prev, emptyAuthor()]);

  const removeAuthor = (index: number) =>
    setAuthors((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !abstract.trim() || !keywords.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (
      authors.some(
        (a) => !a.name.trim() || !a.email.trim() || !a.affiliation.trim(),
      )
    ) {
      setError("Please complete all author fields.");
      return;
    }
    if (!file) {
      setError("Please upload your paper as a PDF.");
      return;
    }
    if (file.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("File size must be under 20 MB.");
      return;
    }

    try {
      setSubmitting(true);
      const uid = firebaseUser.uid;
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `submissions/${uid}/${timestamp}_${safeName}`;

      const fileUrl = await uploadFile(storagePath, file);

      await createSubmission({
        title: title.trim(),
        abstract: abstract.trim(),
        keywords: keywords.trim(),
        topics: selectedTopics,
        authors,
        fileUrl,
        filePath: storagePath,
        status: "submitted",
        submittedBy: uid,
        submitterEmail: userProfile?.email ?? firebaseUser.email ?? "",
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <>
      <Hero
        title="Paper Submission"
        subtitle={`Submit your full paper (PDF) for  ${info?.conferenceName}`}
      />

      <section className="bg-gray-50 py-12">
        <div className={styles.container}>
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-3xl space-y-8"
            noValidate
          >
            {/* Paper Details */}
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Paper Details</h2>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="title">
                  Title <span className={styles.required}>*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Full title of your paper"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="abstract">
                  Abstract <span className={styles.required}>*</span>
                </label>
                <textarea
                  id="abstract"
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  placeholder="250 – 400 words describing the purpose, methods, and findings"
                  rows={6}
                  className={`${styles.input} resize-y`}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="keywords">
                  Keywords <span className={styles.required}>*</span>
                </label>
                <input
                  id="keywords"
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Comma-separated, e.g. machine learning, neural networks"
                  className={styles.input}
                  required
                />
              </div>

              {/* Topic areas */}
              <div className={styles.field}>
                <label className={styles.label}>Topic Areas</label>
                <div className={styles.topicGrid}>
                  {TOPICS.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleTopic(topic)}
                      className={`${styles.topicChip} ${
                        selectedTopics.includes(topic)
                          ? styles.topicChipActive
                          : ""
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Authors */}
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Authors</h2>

              <div className="space-y-4">
                {authors.map((author, i) => (
                  <div key={i} className={styles.authorBlock}>
                    <div className={styles.authorHeader}>
                      <span className={styles.authorLabel}>Author {i + 1}</span>
                      {authors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAuthor(i)}
                          className={styles.removeBtn}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <input
                        type="text"
                        value={author.name}
                        onChange={(e) =>
                          updateAuthor(i, "name", e.target.value)
                        }
                        placeholder="Full name"
                        className={styles.input}
                        required
                      />
                      <input
                        type="email"
                        value={author.email}
                        onChange={(e) =>
                          updateAuthor(i, "email", e.target.value)
                        }
                        placeholder="Email"
                        className={styles.input}
                        required
                      />
                      <input
                        type="text"
                        value={author.affiliation}
                        onChange={(e) =>
                          updateAuthor(i, "affiliation", e.target.value)
                        }
                        placeholder="Institution / affiliation"
                        className={styles.input}
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addAuthor}
                className={styles.addAuthorBtn}
              >
                + Add Author
              </button>
            </div>

            {/* Upload PDF */}
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Upload PDF</h2>
              <p className={styles.hint}>PDF only · max 20 MB</p>

              {file ? (
                <div className={styles.filePill}>
                  <span className={styles.fileName}>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className={styles.clearFile}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div
                  className={styles.dropZone}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.uploadIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      d="M12 16V4m0 0-4 4m4-4 4 4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20 16.7A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-sm text-gray-500">
                    <span className={styles.browseLink}>Browse</span> or drag &
                    drop your PDF here
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pb-8">
              <Link
                to="/"
                className="h-11 px-6 inline-flex items-center justify-center rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="h-11 px-6 bg-[#006a4e] text-white rounded-lg text-sm font-semibold hover:bg-[#00543d] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting…" : "Submit Paper"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
