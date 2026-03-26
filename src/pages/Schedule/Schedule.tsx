import { useEffect, useState } from "react";
import "./Schedule.css";
import { getDataByCollection } from "@/firebase/db";
import type { Schedule as ScheduleModel } from "@/models/Schedule";
import Hero from "@/components/custom/Hero";
import { formatDate } from "@/utils/formatDate";
import { getGeneralInfo } from "@/firebase/services/generalInfoService";
import type { GeneralInfo } from "@/models/GeneralInfo";

function Schedule() {
  const [schedules, setSchedules] = useState<ScheduleModel[]>([]);
  const [info, setInfo] = useState<GeneralInfo | null>();

  useEffect(() => {
    const fetchSchedules = async () => {
      const data = await getDataByCollection<ScheduleModel>("schedules");
      setSchedules(data);
    };
    const fetchInfo = async () => {
      const data = await getGeneralInfo<GeneralInfo>("2026");
      setInfo(data);
    };
    fetchSchedules();
    fetchInfo();
  }, []);

  return (
    <div className="schedule-page">
      <Hero
        title="Conference Schedule"
        subtitle="Two days of keynotes, paper presentations, panels, and networking at
            Northwest Conference 2026."
        date={formatDate(
          info?.importantDates.conferenceStart,
          info?.importantDates.conferenceEnd,
        )}
      />

      {/* Notice Banner */}
      <section className="schedule-notice-section">
        <div className="cfp-container">
          <div className="schedule-notice">
            <span>📢</span>
            <p>
              The full schedule is being finalized. Speaker assignments and room
              details will be updated as confirmations are received.
            </p>
          </div>
        </div>
      </section>

      {/* Schedule Days */}
      {schedules.map((day) => (
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
