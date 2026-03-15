import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import styles from "./SpeakerCard.module.css";
import type { Speaker } from "@/models/Speaker";

function SpeakerCard({ speaker }: { speaker: Speaker }) {
  return (
    <>
      <Card className={styles.speakerCard}>
        <div className="aspect-[2/3] w-full">
          <img
            src={`/src/assets/speakers/${speaker.image}`}
            alt={speaker.name}
            className="relative z-20 w-full aspect-[2/3] object-cover"
          />
        </div>

        <CardContent className="space-y-1">
          <CardTitle>{speaker.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{speaker.title}</p>
          <CardDescription>{speaker.bio}</CardDescription>
        </CardContent>
      </Card>
    </>
  );
}

export default SpeakerCard;
