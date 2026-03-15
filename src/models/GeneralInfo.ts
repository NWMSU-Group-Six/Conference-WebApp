export type ImportantDates = {
  conferenceStart: Date;
  conferenceEnd: Date;

  paperSubmissionDeadline: Date;
  notificationOfAcceptance: Date;
  cameraReadyDeadline: Date;
  presentationSlidesDue?: Date;

  earlyRegistrationDeadline?: Date;
  regularRegistrationDeadline?: Date;
  lateRegistrationDeadline?: Date;
};

export type Location = {
  city: string;
  state?: string;
  country: string;
  venueName: string;
  address?: string;
};

export type ContactInfo = {
  email: string;
  phone?: string;
  website?: string;
};

export type RegistrationInfo = {
  isOpen: boolean;
  requiresPayment: boolean;
  currency?: string;
};

export type ConferenceLinks = {
  callForPapers?: string;
  program?: string;
  registration?: string;
  proceedings?: string;
};

export type GeneralInfo = {
  conferenceName: string;
  location: Location;
  timezone: string;
  venue: string;
  importantDates: ImportantDates;
  description: string;
  theme: string;
  contact: ContactInfo;
  registration: RegistrationInfo;
  links?: ConferenceLinks;
};
