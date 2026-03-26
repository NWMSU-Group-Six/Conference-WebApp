import { useState } from "react";
import styles from "./SpeakerCard.module.css";
import type { Speaker } from "@/models/Speaker";

function SpeakerCard({ speaker }: { speaker: Speaker }) {
  const [expanded, setExpanded] = useState(false);

  const initials = speaker.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={styles.card}>
      <div
        className={styles.row}
        onClick={() => setExpanded((v) => !v)}
        role="button"
        aria-expanded={expanded}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setExpanded((v) => !v)}
      >
        <div className={styles.avatarWrap}>
          {speaker.image ? (
            <img
              src={speaker.image}
              alt={speaker.name}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarFallback}>{initials}</div>
          )}
        </div>

        <div className={styles.info}>
          <p className={styles.name}>{speaker.name}</p>
          <p className={styles.title}>{speaker.title}</p>
        </div>

        <span
          className={`${styles.chevron} ${expanded ? styles.chevronOpen : ""}`}
          aria-hidden
        >
          ▾
        </span>
      </div>

      {expanded && (
        <div className={styles.bio}>
          <p>{speaker.bio}</p>
        </div>
      )}
    </div>
  );
}

export default SpeakerCard;
