import SpeakerCard from "@/components/custom/SpeakerCard";
import styles from "./Speakers.module.css";
import speakerData from "@/data/speakers.json";

function Speakers() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="cfp-container">
          <h1 className="main-heading">Speakers</h1>
          <p className="subtitle">
            Meet the leading experts and innovators who will be sharing their
            insights and research at the Northwest Conference 2026.
          </p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {speakerData.speakers.map((speaker) => (
            <SpeakerCard key={speaker.id} speaker={speaker} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Speakers;
