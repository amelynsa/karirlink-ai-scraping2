import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { config } from "dotenv";

config();

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

export async function readSourcesFromGoogleSheet() {
  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: SCOPES,
  });

  const doc = new GoogleSpreadsheet(
    process.env.GOOGLE_SHEET_ID || "",
    serviceAccountAuth,
  );

  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();

  const sources = rows.map((row) => row.toObject());
  return sources;
}

await readSourcesFromGoogleSheet();
