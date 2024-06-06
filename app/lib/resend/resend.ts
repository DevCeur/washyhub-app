import { Resend } from "resend";

const RESEND_KEY = process.env.RESEND_KEY;

if (!RESEND_KEY) throw new Error("RESEND_KEY env variable is required");

export const resend = new Resend(RESEND_KEY);
