import { getDataByCollection } from "@/firebase/db";
import { useEffect, useState } from "react";
import type { Sponsor } from "@/models/Sponsor";

function Sponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    const fetchSpeakers = async () => {
      const data = await getDataByCollection<Sponsor>("sponsors");
      setSponsors(data);
    };
    fetchSpeakers();
  }, []);

  return (
    <>
      <section className="hero-section">
        <div className="cfp-container">
          <h1 className="main-heading">Sponsors</h1>
          <p className="subtitle">
            Thank you to our generous sponsors who support the Northwest
            Conference 2026.
          </p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sponsors.map((s) => (
            <div key={s.name} className="flex items-center justify-center p-4">
              <img
                src={`/src/assets/sponsors/${s.image}`}
                alt={s.name}
                className="max-h-24 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Sponsors;
