import nodemailer from 'nodemailer';
import 'dotenv/config';

// Gmail credentials stored in .env
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

// Define sender info
const sender = {
  email: GMAIL_USER,
  name: 'StoreIt',
};

// Export transporter and sender
export { transporter, sender };
