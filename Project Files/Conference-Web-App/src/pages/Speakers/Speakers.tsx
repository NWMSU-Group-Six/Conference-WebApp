import SpeakerCard from "@/components/custom/SpeakerCard";

function Speakers() {
  return (
    <>
      <div className="text-3xl font-bold mb-8">Speakers</div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <SpeakerCard />
        <SpeakerCard />
        <SpeakerCard />
        <SpeakerCard />
        <SpeakerCard />
        <SpeakerCard />
      </div>
    </>
  );
}

export default Speakers;
