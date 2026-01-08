import { jsonSchema } from "../schema/schema.ts";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function extractData(rawData: string) {
  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
    You have to extract job listings from the following raw HTML content: ${rawData}.
    Extract relevant information according to the provided JSON schema for each job listing.
    For salary, you have to decide between 3 options specified below:
    1) { "type": "fixed" (Fixed salary in a period of time), "amount": The amount of the salary }
    2) { "type": "range" (Salary in certain range), min: The lower limit, max: The upper limit }
    3) { "type": "not specified" (salary info not provided) }

    If you cannot extract any meaningful job listing data, return empty string "".

	  Else, Return list of jobs in JSON format only as specified by the schema.
    `,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: jsonSchema,
    },
  });

  const data = response.text || JSON.stringify([]);

  return { data, usage: response.usageMetadata };
}
