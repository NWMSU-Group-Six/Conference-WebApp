import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getReviewers } from "@/firebase/services/userService";
import { getDataByCollection } from "@/firebase/db";
import type { User } from "@/models/User";
import type { Submission } from "@/models/Submission";
import styles from "./Reviewers.module.css";
import { formatDate } from "@/utils/formatDate";
import Hero from "@/components/custom/Hero";

export default function Reviewers() {
  const { firebaseUser, userProfile, loading: authLoading } = useAuth();
  const [reviewers, setReviewers] = useState<User[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingReviewers, setLoadingReviewers] = useState(true);
  const [loadingDocs, setLoadingDocs] = useState(false);

  const canViewSubmissions = Boolean(
    userProfile?.roles.includes("reviewer") || userProfile?.roles.includes("admin"),
  );

  useEffect(() => {
    getReviewers()
      .then(setReviewers)
      .finally(() => setLoadingReviewers(false));
  }, []);

  useEffect(() => {
    if (!firebaseUser || !canViewSubmissions) return;
    setLoadingDocs(true);
    getDataByCollection<Submission>("submissions")
      .then(setSubmissions)
      .catch(() => setSubmissions([]))
      .finally(() => setLoadingDocs(false));
  }, [firebaseUser, canViewSubmissions]);

  return (
    <div className={styles.page}>
      <Hero
        title="Reviewers"
        subtitle="Technical reviewers for Northwest Conference 2026"
      />

      <div className={styles.container}>
        {/* Reviewers list */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Program Committee Reviewers</h2>

          {loadingReviewers ? (
            <p className={styles.empty}>Loading reviewers…</p>
          ) : reviewers.length === 0 ? (
            <p className={styles.empty}>No reviewers have been added yet.</p>
          ) : (
            <div className={styles.grid}>
              {reviewers.map((r) => (
                <div key={r.uid} className={styles.card}>
                  <div className={styles.avatar}>
                    {r.profile.firstName?.[0]}
                    {r.profile.lastName?.[0]}
                  </div>
                  <div className={styles.info}>
                    <p className={styles.name}>
                      {r.profile.firstName} {r.profile.lastName}
                    </p>
                    {r.profile.affiliation && (
                      <p className={styles.affiliation}>
                        {r.profile.affiliation}
                      </p>
                    )}
                    <p className={styles.email}>{r.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Submitted documents – restricted to reviewer/admin roles */}
        {authLoading ? (
          <section className={styles.section}>
            <p className={styles.empty}>Loading access rights…</p>
          </section>
        ) : canViewSubmissions ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Submitted Papers</h2>

            {loadingDocs ? (
              <p className={styles.empty}>Loading submissions…</p>
            ) : submissions.length === 0 ? (
              <p className={styles.empty}>
                No submissions found in the database.
              </p>
            ) : (
              <div className={styles.docList}>
                {submissions.map((s) => (
                  <div key={s.id} className={styles.docRow}>
                    <div className={styles.docMain}>
                      <p className={styles.docTitle}>{s.title || "Untitled"}</p>
                      {s.authors && (
                        <p className={styles.docMeta}>
                          Authors: {s.authors.map((a) => a.name).join(", ")}
                        </p>
                      )}
                      {s.abstract && (
                        <p className={styles.docAbstract}>{s.abstract}</p>
                      )}
                    </div>
                    {s.submittedAt && (
                      <span className={styles.docDate}>
                        {formatDate(s.submittedAt)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : firebaseUser ? (
          <div className={styles.loginPrompt}>
            <p>
              Your account can view the public reviewer list, but submitted
              papers are limited to reviewer and admin accounts.
            </p>
          </div>
        ) : null}

        {!firebaseUser && (
          <div className={styles.loginPrompt}>
            <p>Sign in to view submitted papers and assignments.</p>
            <Link to="/login" className={styles.loginBtn}>
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
