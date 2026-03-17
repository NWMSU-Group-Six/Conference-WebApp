export type Session = {
  location: string;
  speaker?: string;
  time: string;
  title: string;
  type: "break" | "keynote" | "session" | "panel";
};

export type Schedule = {
  date: string;
  day: string;
  sessions: Session[];
};
