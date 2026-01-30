import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// LOAD ENV
dotenv.config({
  path: path.join(__dirname, ".env"),
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// PATH FILE CSV
const filePath = path.join(
  __dirname,
  "..",
  "storage",
  "test-result-2026-01-28T12-33-31-998Z_CLEANED_FINAL_V2.csv"
);

await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: "rnur71@gmail.com",
  subject: "Hasil Scraping (CSV)",
  text: "berikut",
  attachments: [
    {
      filename: "hasil-scraping.csv",
      path: filePath,
    },
  ],
});

console.log("Email + file terkirim ");
