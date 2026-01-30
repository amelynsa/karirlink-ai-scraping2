import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import nodemailer from "nodemailer";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const date = new Date().toLocaleDateString("id-ID", {
  timeZone: "Asia/Jakarta",
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const timestamp = new Date().toLocaleDateString("id-ID").replace(/[/]/g, "-");

export async function sendCSVToEmail(filename: string) {
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
    to: "ameliayunisaa@gmail.com",
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
