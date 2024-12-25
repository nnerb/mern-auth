import { MailtrapClient } from "mailtrap";
import dotevn from "dotenv";

dotevn.config();

export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_API_TOKEN,
});

export const sender = {
  email: "mern_app@demomailtrap.com",
  name: "Auth MERN App",
};