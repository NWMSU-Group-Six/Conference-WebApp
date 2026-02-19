import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function SpeakerCard({ speaker }) {
  return (
    <Card className="mx-auto w-full max-w-sm overflow-hidden rounded-xl hover:shadow-lg transition relative pt-0">
      <div className="aspect-[3/2] w-full">
        <img
          src={`/src/assets/speakers/${speaker.image}`}
          alt={speaker.name}
          className="relative z-20 w-full aspect-[3/2] object-cover"
        />
      </div>

      <CardContent className="space-y-1">
        <CardTitle>{speaker.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{speaker.title}</p>
        <CardDescription>{speaker.bio}</CardDescription>
      </CardContent>
    </Card>
  );
}

export default SpeakerCard;
