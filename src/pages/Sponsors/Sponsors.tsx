import { getDataByCollection } from "@/firebase/db";
import { useEffect, useState } from "react";
import type { Sponsor } from "@/models/Sponsor";
import Hero from "@/components/custom/Hero";
import type { GeneralInfo } from "@/models/GeneralInfo";
import { getGeneralInfo } from "@/firebase/services/generalInfoService";

function Sponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [info, setInfo] = useState<GeneralInfo | null>();

  useEffect(() => {
    const fetchSponsors = async () => {
      const data = await getDataByCollection<Sponsor>("sponsors");
      setSponsors(data);
    };
    const fetchInfo = async () => {
      const data = await getGeneralInfo<GeneralInfo>("2026");
      setInfo(data);
    };
    fetchSponsors();
    fetchInfo();
  }, []);

  return (
    <>
      <Hero
        title="Sponsors"
        subtitle={`Thank you to our generous sponsors who support the ${info?.conferenceName}`}
      />

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
