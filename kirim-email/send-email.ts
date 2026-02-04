import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import nodemailer from "nodemailer";
import { __dirname } from "../utils/__dirname.ts";

config();

const date = new Date().toLocaleDateString("id-ID", {
  timeZone: "Asia/Jakarta",
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const timestamp = new Date().toLocaleDateString("id-ID").replace(/[/]/g, "-");

export async function sendCSVToEmail(filename: string, to: string) {
  // PATH FILE CSV
  const filePath = path.join(__dirname, "..", "storage", filename);

  // LOAD ENV
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: to,
    subject: `Hasil Scraping Daftar Lowongan Kerja - ${date}`,
    text: "Berikut terlampir file daftar lowongan kerja dalam format csv.",
    attachments: [
      {
        filename: `hasil-scraping-${timestamp}.csv`,
        path: filePath,
      },
    ],
  });

  console.log("Email + file terkirim ");
}
