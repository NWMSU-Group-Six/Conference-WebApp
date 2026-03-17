export type UserRole = "author" | "reviewer" | "chair" | "admin" | "sponsor";

export type Registration = {
  registered: boolean;
  paymentStatus: "pending" | "paid";
  ticketType?: string;
  registeredAt?: Date;
};

export type User = {
  uid: string;
  email: string;

  profile: {
    firstName: string;
    lastName: string;
    affiliation?: string;
  };

  roles: UserRole[];

  registration?: Registration;

  createdAt: Date;
};
