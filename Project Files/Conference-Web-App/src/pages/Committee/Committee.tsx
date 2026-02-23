import "./Committee.css";

const generalChairs = [
  {
    name: "To Be Announced",
    role: "General Chair",
    affiliation: "Northwest University",
  },
  {
    name: "To Be Announced",
    role: "Co-General Chair",
    affiliation: "Northwest University",
  },
];

const programChairs = [
  {
    name: "To Be Announced",
    role: "Program Chair",
    affiliation: "Northwest University",
  },
  {
    name: "To Be Announced",
    role: "Program Co-Chair",
    affiliation: "Northwest University",
  },
];

const organizingCommittee = [
  { name: "To Be Announced", role: "Publicity Chair", affiliation: "TBA" },
  { name: "To Be Announced", role: "Publication Chair", affiliation: "TBA" },
  { name: "To Be Announced", role: "Registration Chair", affiliation: "TBA" },
  { name: "To Be Announced", role: "Local Arrangements Chair", affiliation: "TBA" },
  { name: "To Be Announced", role: "Web Chair", affiliation: "TBA" },
];

const technicalReviewers = [
  "To Be Announced",
  "To Be Announced",
  "To Be Announced",
  "To Be Announced",
  "To Be Announced",
  "To Be Announced",
  "To Be Announced",
  "To Be Announced",
];

function Committee() {
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
            {generalChairs.map((member, i) => (
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
            {programChairs.map((member, i) => (
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
            {organizingCommittee.map((member, i) => (
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
            {technicalReviewers.map((name, i) => (
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
