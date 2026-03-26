import { Link } from "react-router-dom";
import styles from "./Submit.module.css";
import ScrollToHash from "@/utils/scrollToHash";
import { formatDate } from "@/utils/formatDate";
import { useEffect, useState } from "react";
import type { GeneralInfo } from "@/models/GeneralInfo";
import { getGeneralInfo } from "@/firebase/services/generalInfoService";
import Hero from "@/components/custom/Hero";

export default function Submit() {
  const [info, setInfo] = useState<GeneralInfo | null>();

  useEffect(() => {
    const fetchInfo = async () => {
      const data = await getGeneralInfo<GeneralInfo>("2026");
      setInfo(data);
    };
    fetchInfo();
  }, []);

  const deadlines = [
    {
      step: "01",
      label: "Paper Submission Deadline",
      date: formatDate(info?.importantDates.paperSubmissionDeadline),
      description: "Final deadline for paper submissions",
    },
    {
      step: "02",
      label: "Notification of Acceptance",
      date: formatDate(info?.importantDates.notificationOfAcceptance),
      description: "Authors will be notified of acceptance decisions",
    },
    {
      step: "03",
      label: "Camera-Ready Submission",
      date: formatDate(info?.importantDates.cameraReadyDeadline),
      description: "Final version of accepted papers due",
    },
    {
      step: "04",
      label: "Presentation Slides Due",
      date: formatDate(info?.importantDates.presentationSlidesDue),
      description: "Submit your presentation materials",
    },
    {
      step: "05",
      label: "Early Registration Deadline",
      date: formatDate(info?.importantDates.earlyRegistrationDeadline),
      description: "Register early for discounted rates",
    },
    {
      step: "06",
      label: "Conference Date",
      date: formatDate(
        info?.importantDates.conferenceStart,
        info?.importantDates.conferenceEnd,
      ),
      description: "Main conference event",
    },
  ];

  return (
    <div className={styles.callForPapers}>
      <Hero
        title="Call for Submissions"
        subtitle={`We invite researchers, practitioners, and academics to submit their
            original work for presentation at our conference.`}
      />

      {/* Submission Guidelines */}
      <section className={styles.guidelinesSection}>
        <div className={styles.cfpContainer}>
          <h2 className={styles.sectionHeading}>Submission Guidelines</h2>
          <div className={styles.contentCard}>
            <div className={styles.guidelineGroup}>
              <h3 className={styles.guidelineTitle}>Paper Format</h3>
              <ul className={styles.guidelineList}>
                <li>Papers must be written in English</li>
                <li>
                  Maximum 6 pages including references, figures and tables
                </li>
                <li>Must follow ACM format (two-column)</li>
                <li>File must be submitted as PDF only</li>
              </ul>
            </div>

            <div className={styles.guidelineGroup}>
              <h3 className={styles.guidelineTitle}>Content Requirements</h3>
              <ul className={styles.guidelineList}>
                <li>Original unpublished work only</li>
                <li>Must include abstract (150–200 words)</li>
                <li>Must include keywords (3–5)</li>
                <li>Proper citations and references required</li>
              </ul>
            </div>

            <div className={styles.guidelineGroup}>
              <h3 className={styles.guidelineTitle}>Submission Rules</h3>
              <ul className={styles.guidelineList}>
                <li>One submission per author</li>
                <li>Author names must be removed for blind review</li>
                <li>No plagiarism — submissions will be checked</li>
                <li>
                  Previously published or currently under review work will be
                  rejected
                </li>
              </ul>
            </div>

            <div className={styles.guidelineGroup}>
              <h3 className={styles.guidelineTitle}>Review Process</h3>
              <ul className={styles.guidelineList}>
                <li>All papers undergo double-blind peer review</li>
                <li>Reviewed by at least 2 program committee members</li>
                <li>Authors notified of acceptance/rejection by deadline</li>
              </ul>
            </div>

            <div className={styles.guidelineGroup}>
              <h3 className={styles.guidelineTitle}>Acceptance</h3>
              <ul className={styles.guidelineList}>
                <li>Accepted papers must be presented at the conference</li>
                <li>At least one author must register for the conference</li>
                <li>Camera-ready version must be submitted by the deadline</li>
                <li>
                  Accepted papers will be published in the conference
                  proceedings
                </li>
              </ul>
            </div>

            <p className={styles.guidelineNote}>
              ℹ More detailed submission guidelines will be posted soon. Please
              check back for updates.
            </p>
          </div>
        </div>
      </section>

      {/* ── Important Deadlines ── */}
      <section id="deadlines" className={styles.dates}>
        <div className={styles.sectionInner}>
          <span className={styles.sectionLabel}>Mark Your Calendar</span>
          <h2 className={styles.sectionTitle}>Important Deadlines</h2>
          <div className={styles.datesGrid}>
            {deadlines.map((item) => (
              <div key={item.label} className={styles.dateCard}>
                <span className={styles.dateStep}>{item.step}</span>
                <p className={styles.dateLabel}>{item.label}</p>
                <p className={styles.dateValue}>{item.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit */}
      <section className={styles.submitSection}>
        <div className={styles.cfpContainer}>
          <h2 className={styles.sectionHeading}>Ready to Submit?</h2>
          <p className={styles.submitDescription}>
            Submit your paper through our online submission system. Make sure to
            review the guidelines before submitting.
          </p>
          <Link
            to="/submission"
            onClick={ScrollToHash}
            className={styles.submitButton}
          >
            Submit Your Paper
          </Link>
          <p className={styles.helpText}>
            Need help? Contact us at{" "}
            <a href={`mailto:${info?.contact.email}`}>{info?.contact.email}</a>
          </p>
        </div>
      </section>
    </div>
  );
}
