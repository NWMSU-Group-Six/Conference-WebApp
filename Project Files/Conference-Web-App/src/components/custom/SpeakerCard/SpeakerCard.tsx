import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function SpeakerCard({ speaker }) {
  return (
    <Card className="mx-auto w-full max-w-sm overflow-hidden transition hover:shadow-lg">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={speaker.image}
          alt={speaker.name}
          className="h-full w-full object-cover"
        />
      </div>

      <CardContent className="space-y-1 p-4">
        <CardTitle>{speaker.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{speaker.title}</p>
        <CardDescription>{speaker.bio}</CardDescription>
      </CardContent>
    </Card>
  );
}

export default SpeakerCard;
