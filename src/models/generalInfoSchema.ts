import { z } from "zod";

export const importantDatesSchema = z.object({
  conferenceStart: z.date(),
  conferenceEnd: z.date(),
  paperSubmissionDeadline: z.date(),
  notificationOfAcceptance: z.date(),
  cameraReadyDeadline: z.date(),
  presentationSlidesDue: z.date().optional(),
  earlyRegistrationDeadline: z.date().optional(),
  regularRegistrationDeadline: z.date().optional(),
  lateRegistrationDeadline: z.date().optional(),
});

export const locationSchema = z.object({
  city: z.string(),
  state: z.string().optional(),
  country: z.string(),
  venueName: z.string(),
  zip: z.string().optional(),
  street: z.string().optional(),
});

export const generalInfoSchema = z.object({
  conferenceName: z.string(),
  location: locationSchema,
  timezone: z.string(),
  venue: z.string(),
  importantDates: importantDatesSchema,
  description: z.string(),
  theme: z.string(),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().optional(),
    website: z.string().optional(),
  }),
  registration: z.object({
    isOpen: z.boolean(),
    requiresPayment: z.boolean(),
    currency: z.string().optional(),
  }),
  links: z
    .object({
      callForPapers: z.string().optional(),
      program: z.string().optional(),
      registration: z.string().optional(),
      proceedings: z.string().optional(),
    })
    .optional(),
});
