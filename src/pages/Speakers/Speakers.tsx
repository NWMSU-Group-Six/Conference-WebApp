import SpeakerCard from "@/components/custom/SpeakerCard";
import { getDataByCollection } from "@/firebase/db";
import { useEffect, useState } from "react";
import type { Speaker } from "@/models/Speaker";

function Speakers() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDataByCollection<Speaker>("speakers")
      .then(setSpeakers)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero-section">
        <div className="cfp-container">
          <h1 className="main-heading">Speakers</h1>
          <p className="subtitle">
            Meet the leading experts and innovators sharing their insights at
            Northwest Conference 2026.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-14">
        {loading ? (
          <p className="text-center text-gray-500 py-16">Loading speakers…</p>
        ) : speakers.length === 0 ? (
          <p className="text-center text-gray-400 py-16">
            Speakers will be announced soon.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {speakers.map((speaker) => (
              <SpeakerCard key={speaker.id} speaker={speaker} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Speakers;
