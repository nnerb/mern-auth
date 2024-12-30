export interface UserProps {
  _id: string;
  email: string;
  name: string;
  isVerified: boolean,
  verificationToken: string;
  verificationTokenExpiresAt: string;
  lastLogin: string
  createdAt: string;
  updatedAt: string;
}
