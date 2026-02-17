import SpeakerCard from "@/components/custom/SpeakerCard";
import styles from "./Speakers.module.css";
import speakerData from "@/data/speakers.json";

function Speakers() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-12 text-center">
        Meet Our Speakers
      </h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {speakerData.speakers.map((speaker) => (
          <SpeakerCard key={speaker.id} speaker={speaker} />
        ))}
      </div>
    </div>
  );
}

export default Speakers;
