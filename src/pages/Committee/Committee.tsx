import { useEffect, useState } from "react";
import "./Committee.css";
import type { Committee } from "@/models/Committee";
import { getCommittee } from "@/firebase/services/committeeService";

function Committee() {
  const [committee, setCommittee] = useState<Committee | null>();

  useEffect(() => {
    const fetchCommittee = async () => {
      const data = await getCommittee<Committee>("2026");
      setCommittee(data);
    };
    fetchCommittee();
  }, []);

  return (
    <div className="committee-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="cfp-container">
          <h1 className="main-heading">Conference Committee</h1>
          <p className="subtitle">
            Meet the dedicated team of organizers and reviewers working behind
            the scenes to make Northwest Conference 2026 a success.
          </p>
        </div>
      </section>

      {/* General Chairs */}
      <section className="committee-section section-light">
        <div className="cfp-container">
          <h2 className="section-heading">General Chairs</h2>
          <div className="member-grid">
            {committee?.generalChairs.map((member, i) => (
              <div key={i} className="member-card card-chair">
                <div className="member-avatar">{member.name[0]}</div>
                <h3 className="member-name">{member.name}</h3>
                <span className="member-role">{member.role}</span>
                <p className="member-affiliation">{member.affiliation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Committee Chairs */}
      <section className="committee-section section-white">
        <div className="cfp-container">
          <h2 className="section-heading">Program Committee Chairs</h2>
          <div className="member-grid">
            {committee?.programChairs.map((member, i) => (
              <div key={i} className="member-card card-program">
                <div className="member-avatar">{member.name[0]}</div>
                <h3 className="member-name">{member.name}</h3>
                <span className="member-role">{member.role}</span>
                <p className="member-affiliation">{member.affiliation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizing Committee */}
      <section className="committee-section section-light">
        <div className="cfp-container">
          <h2 className="section-heading">Organizing Committee</h2>
          <div className="member-grid">
            {committee?.organizingCommittee.map((member, i) => (
              <div key={i} className="member-card card-organizing">
                <div className="member-avatar">{member.name[0]}</div>
                <h3 className="member-name">{member.name}</h3>
                <span className="member-role">{member.role}</span>
                <p className="member-affiliation">{member.affiliation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Program Committee / Reviewers */}
      <section className="committee-section section-white">
        <div className="cfp-container">
          <h2 className="section-heading">Technical Program Committee</h2>
          <p className="committee-intro">
            Our technical reviewers are experts from academia and industry who
            ensure the quality and rigor of accepted papers.
          </p>
          <div className="reviewer-grid">
            {committee?.technicalReviewers.map((name, i) => (
              <div key={i} className="reviewer-card">
                <span className="reviewer-dot" />
                <span className="reviewer-name">{name}</span>
              </div>
            ))}
          </div>
          <p className="committee-note">
            * Full reviewer list will be published once confirmations are
            received.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Committee;
