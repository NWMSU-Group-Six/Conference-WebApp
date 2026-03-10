import "./Schedule.css";

const scheduleData = [
  {
    day: "Day 1",
    date: "September 14, 2026",
    sessions: [
      {
        time: "8:00 AM – 9:00 AM",
        title: "Registration & Breakfast",
        type: "break",
        location: "Main Lobby",
      },
      {
        time: "9:00 AM – 9:30 AM",
        title: "Opening Ceremony & Welcome Address",
        type: "keynote",
        speaker: "Conference Chair",
        location: "Auditorium A",
      },
      {
        time: "9:30 AM – 10:30 AM",
        title: "Keynote: The Future of Human-Computer Interaction",
        type: "keynote",
        speaker: "To Be Announced",
        location: "Auditorium A",
      },
      {
        time: "10:30 AM – 11:00 AM",
        title: "Coffee Break & Networking",
        type: "break",
        location: "Foyer",
      },
      {
        time: "11:00 AM – 12:30 PM",
        title: "Paper Session 1: Artificial Intelligence & Machine Learning",
        type: "session",
        location: "Room 101",
      },
      {
        time: "12:30 PM – 1:30 PM",
        title: "Lunch Break",
        type: "break",
        location: "Dining Hall",
      },
      {
        time: "1:30 PM – 3:00 PM",
        title: "Paper Session 2: Data Science & Analytics",
        type: "session",
        location: "Room 101",
      },
      {
        time: "3:00 PM – 3:30 PM",
        title: "Coffee Break",
        type: "break",
        location: "Foyer",
      },
      {
        time: "3:30 PM – 5:00 PM",
        title: "Panel Discussion: Challenges in Modern Software Engineering",
        type: "panel",
        location: "Auditorium B",
      },
    ],
  },
  {
    day: "Day 2",
    date: "September 15, 2026",
    sessions: [
      {
        time: "8:30 AM – 9:00 AM",
        title: "Morning Coffee & Networking",
        type: "break",
        location: "Foyer",
      },
      {
        time: "9:00 AM – 10:00 AM",
        title: "Keynote: Security and Privacy in Distributed Systems",
        type: "keynote",
        speaker: "To Be Announced",
        location: "Auditorium A",
      },
      {
        time: "10:00 AM – 10:30 AM",
        title: "Coffee Break",
        type: "break",
        location: "Foyer",
      },
      {
        time: "10:30 AM – 12:00 PM",
        title: "Paper Session 3: Networking & Cyber Security",
        type: "session",
        location: "Room 101",
      },
      {
        time: "12:00 PM – 1:00 PM",
        title: "Lunch Break",
        type: "break",
        location: "Dining Hall",
      },
      {
        time: "1:00 PM – 2:30 PM",
        title: "Paper Session 4: Human-Computer Interaction",
        type: "session",
        location: "Room 102",
      },
      {
        time: "2:30 PM – 3:00 PM",
        title: "Coffee Break",
        type: "break",
        location: "Foyer",
      },
      {
        time: "3:00 PM – 4:00 PM",
        title: "Best Paper Awards & Closing Remarks",
        type: "keynote",
        speaker: "Conference Chair",
        location: "Auditorium A",
      },
    ],
  },
];

function Schedule() {
  return (
    <div className="schedule-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="cfp-container">
          <h1 className="main-heading">Conference Schedule</h1>
          <p className="subtitle">
            Two days of keynotes, paper presentations, panels, and networking
            at Northwest Conference 2026.
          </p>
          <p className="schedule-dates">September 14 – 15, 2026</p>
        </div>
      </section>

      {/* Notice Banner */}
      <section className="schedule-notice-section">
        <div className="cfp-container">
          <div className="schedule-notice">
            <span>📢</span>
            <p>
              The full schedule is being finalized. Speaker assignments and
              room details will be updated as confirmations are received.
            </p>
          </div>
        </div>
      </section>

      {/* Schedule Days */}
      {scheduleData.map((day) => (
        <section key={day.day} className="schedule-day-section">
          <div className="cfp-container">
            <div className="day-header">
              <h2 className="day-title">{day.day}</h2>
              <span className="day-date">{day.date}</span>
            </div>

            <div className="sessions-list">
              {day.sessions.map((session, index) => (
                <div
                  key={index}
                  className={`session-row session-${session.type}`}
                >
                  <div className="session-time">{session.time}</div>
                  <div className="session-info">
                    <p className="session-title">{session.title}</p>
                    {session.speaker && (
                      <p className="session-speaker">{session.speaker}</p>
                    )}
                    <p className="session-location">📍 {session.location}</p>
                  </div>
                  <div className="session-badge-wrapper">
                    <span className={`session-badge badge-${session.type}`}>
                      {session.type === "keynote"
                        ? "Keynote"
                        : session.type === "session"
                        ? "Paper Session"
                        : session.type === "panel"
                        ? "Panel"
                        : "Break"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

export default Schedule;
