export type GeneralChair = {
  affiliation: string;
  name: string;
  role: string;
};

export type Committee = {
  generalChairs: GeneralChair[];
  organizingCommittee: GeneralChair[];
  programChairs: GeneralChair[];
  technicalReviewers: string[];
};
