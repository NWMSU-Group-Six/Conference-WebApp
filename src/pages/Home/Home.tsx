import { Link } from "react-router-dom";
import { scrollToTop } from "@/utils/scrollToTop";
import styles from "./Home.module.css";
import { useEffect, useState } from "react";
import type { GeneralInfo } from "@/models/GeneralInfo";
import { getGeneralInfo } from "@/firebase/services/generalInfoService";
import { formatDate } from "@/utils/formatDate";

function Home() {
  const [info, setInfo] = useState<GeneralInfo | null>();

  useEffect(() => {
    const fetchInfo = async () => {
      const data = await getGeneralInfo<GeneralInfo>("2026");
      setInfo(data);
    };
    fetchInfo();
  }, []);

  const keyDates = [
    {
      label: "Paper Submission Deadline",
      date: formatDate(info?.importantDates.paperSubmissionDeadline),
      step: "01",
    },
    {
      label: "Notification of Acceptance",
      date: formatDate(info?.importantDates.notificationOfAcceptance),
      step: "02",
    },
    {
      label: "Camera-Ready Deadline",
      date: formatDate(info?.importantDates.cameraReadyDeadline),
      step: "03",
    },
    {
      label: "Conference Dates",
      date: formatDate(
        info?.importantDates.conferenceStart,
        info?.importantDates.conferenceEnd,
      ),
      step: "04",
    },
  ];

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <img
          src="/images/bg-fall2025.webp"
          alt="Northwest Missouri State University campus"
          className={styles.heroBg}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <img src="/images/logo-n.svg" alt="" className={styles.heroLogo} />
          <h1 className={styles.heroTitle}>
            {info?.conferenceName}{" "}
            <span className={styles.heroTitleAccent}>2026</span>
          </h1>
          <p className={styles.heroSubtitle}>{info?.description}</p>
          <p className={styles.heroDates}>
            {formatDate(
              info?.importantDates.conferenceStart,
              info?.importantDates.conferenceEnd,
            )}{" "}
            · {`${info?.location.city}, ${info?.location.state}`}
          </p>
          <div className={styles.heroCtas}>
            <Link
              to="/register"
              onClick={scrollToTop}
              className={styles.ctaPrimary}
            >
              Register Now
            </Link>
            <Link
              to="/submit"
              onClick={scrollToTop}
              className={styles.ctaSecondary}
            >
              Submit a Paper
            </Link>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className={styles.about}>
        <div className={styles.aboutInner}>
          <div className={styles.aboutText}>
            <span className={styles.sectionLabel}>About the Conference</span>
            <h2 className={styles.sectionTitle}>
              Advancing Knowledge at Northwest
            </h2>
            <p className={styles.bodyText}>
              The {info?.conferenceName} is an annual gathering hosted by{" "}
              {info?.venue}. The event unites scholars, practitioners, and
              students from across the region to share cutting-edge research in
              computing, engineering, and related disciplines.
            </p>
            <p className={styles.bodyText}>
              From keynote addresses to peer-reviewed paper sessions and
              interactive panels, the conference offers something for everyone
              in the academic and professional community.
            </p>
            <Link
              to="/committee"
              onClick={scrollToTop}
              className={styles.textLink}
            >
              Meet the Committee →
            </Link>
          </div>
          <div className={styles.aboutImageWrap}>
            <img
              src="/images/colden-fall2015-800x533.webp"
              alt="Colden Hall, Northwest Missouri State University"
              className={styles.aboutImage}
            />
          </div>
        </div>
      </section>

      {/* ── Key Dates ── */}
      <section className={styles.dates}>
        <div className={styles.sectionInner}>
          <span className={styles.sectionLabel}>Mark Your Calendar</span>
          <h2 className={styles.sectionTitle}>Key Dates</h2>
          <div className={styles.datesGrid}>
            {keyDates.map((item) => (
              <div key={item.label} className={styles.dateCard}>
                <span className={styles.dateStep}>{item.step}</span>
                <p className={styles.dateLabel}>{item.label}</p>
                <p className={styles.dateValue}>{item.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Call for Papers ── */}
      <section className={styles.cfp}>
        <div className={styles.cfpInner}>
          <div className={styles.cfpImageWrap}>
            <img
              src="/images/secure-programming-fall2023-800x533.webp"
              alt="Students working at Northwest Missouri State University"
              className={styles.cfpImage}
            />
          </div>
          <div className={styles.cfpText}>
            <span className={styles.sectionLabelLight}>Call for Papers</span>
            <h2 className={styles.sectionTitleLight}>Share Your Research</h2>
            <p className={styles.bodyTextLight}>
              We invite original research contributions in all areas of
              computing and related fields. All submissions will undergo
              rigorous peer review. Accepted papers will be presented at the
              conference.
            </p>
            <ul className={styles.cfpTopics}>
              <li>Artificial Intelligence &amp; Machine Learning</li>
              <li>Cybersecurity &amp; Distributed Systems</li>
              <li>Human-Computer Interaction</li>
              <li>Data Science &amp; Analytics</li>
              <li>Software Engineering</li>
            </ul>
            <Link
              to="/submit"
              onClick={scrollToTop}
              className={styles.ctaPrimary}
            >
              View Submission Guidelines
            </Link>
          </div>
        </div>
      </section>

      {/* ── Venue ── */}
      <section className={styles.venue}>
        <div className={styles.venueInner}>
          <div className={styles.venueTextBlock}>
            <span className={styles.sectionLabel}>Venue</span>
            <img src="/images/logo-n.svg" alt="" className={styles.venueLogo} />
            <h2 className={styles.sectionTitle}>{info?.location.venueName}</h2>
            <p className={styles.bodyText}>
              {info?.location.street}, {info?.location.city},{" "}
              {info?.location.state} {info?.location.zip}
            </p>
            <a
              href={info?.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.visitLink}
            >
              Visit Our Campus →
            </a>
          </div>
          <div className={styles.venueImageWrap}>
            <img
              src="/images/campus-fall2025-lc-749.webp"
              alt="Northwest Missouri State University campus"
              className={styles.venueHeroImg}
            />
          </div>
        </div>
      </section>

      {/* ── Bottom CTA Banner ── */}
      <section className={styles.banner}>
        <div className={styles.bannerInner}>
          <h2 className={styles.bannerTitle}>Ready to Participate?</h2>
          <p className={styles.bannerSub}>
            Register for the conference or submit your paper before the
            deadline.
          </p>
          <div className={styles.heroCtas}>
            <Link
              to="/register"
              onClick={scrollToTop}
              className={styles.ctaPrimary}
            >
              Register Now
            </Link>
            <Link
              to="/submit"
              onClick={scrollToTop}
              className={styles.ctaSecondaryDark}
            >
              Submit a Paper
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
