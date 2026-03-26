export type UserRole = "user" | "reviewer" | "admin";

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
