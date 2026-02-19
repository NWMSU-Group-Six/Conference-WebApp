import { Link } from "react-router-dom";
import "./call-for-papers.css";

export default function CallForPapers() {
  return (
    <div className="call-for-papers">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="cfp-container">
          <h1 className="main-heading">Call for Submissions</h1>
          <p className="subtitle">
            We invite researchers, practitioners, and academics to submit their
            original work for presentation at our conference.
          </p>
        </div>
      </section>

      {/* Submission Guidelines */}
      <section className="guidelines-section">
        <div className="cfp-container">
          <h2 className="section-heading">Submission Guidelines</h2>
          <div className="content-card">
            <p className="muted-center">
              Submission instructions will be posted soon. Please prepare your
              manuscript in a standard academic format and check back for the
              official template and submission steps.
            </p>
          </div>
        </div>
      </section>

      {/* Deadlines */}
      <section id="deadlines" className="deadlines-section">
        <div className="cfp-container">
          <h2 className="section-heading">Important Deadlines</h2>

          <div className="deadline-grid">
            <div className="deadline-box">
              <h3>Paper Submission Deadline</h3>
              <p className="date">March 15, 2026</p>
              <p className="description">
                Final deadline for paper submissions
              </p>
            </div>

            <div className="deadline-box">
              <h3>Notification of Acceptance</h3>
              <p className="date">May 1, 2026</p>
              <p className="description">
                Authors will be notified of acceptance decisions
              </p>
            </div>

            <div className="deadline-box">
              <h3>Camera-Ready Submission</h3>
              <p className="date">June 1, 2026</p>
              <p className="description">
                Final version of accepted papers due
              </p>
            </div>

            <div className="deadline-box">
              <h3>Presentation Slides Due</h3>
              <p className="date">July 1, 2026</p>
              <p className="description">Submit your presentation materials</p>
            </div>

            <div className="deadline-box">
              <h3>Early Registration Deadline</h3>
              <p className="date">July 10, 2026</p>
              <p className="description">Register early for discounted rates</p>
            </div>

            <div className="deadline-box">
              <h3>Conference Date</h3>
              <p className="date">July 15–17, 2026</p>
              <p className="description">Main conference event</p>
            </div>
          </div>
        </div>
      </section>

      {/* Submit */}
      <section className="submit-section">
        <div className="cfp-container">
          <h2 className="section-heading">Ready to Submit?</h2>
          <p className="submit-description">
            Submit your paper through our online submission system. Make sure to
            review the guidelines before submitting.
          </p>

          <Link to="/submission-portal" className="submit-button">
            Submit Your Paper
          </Link>

          <p className="help-text">
            Need help? Contact us at{" "}
            <a href="mailto:s559222@nwmissouri.edu">s559222@nwmissouri.edu</a>
          </p>
        </div>
      </section>
    </div>
  );
}
