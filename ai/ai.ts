import { jsonSchema, nextBtnJsonSchema } from "../schema/schema.ts";
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

export async function getNextButton(rawData: string) {
  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
    You have to identify the next page button/link element from the following raw HTML content: ${rawData}, if there is any pagination.
  
      First, check if this "${initialSelector}" is a valid SELECTOR for the next page button/link from the specified raw HTML content.
      If valid, then return it as is. If not valid, then do as told below.
   
    You have to determine the most proper SELECTOR for the next button or link(anchor) element. Can be combination of selectors or specific selector like class or id. Must be VALID selector for CSS only.
    
    If found, Return as a string to the provided json schema.
    else, return only empty string.
    `,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: nextBtnJsonSchema,
    },
  });

  const data = response.text || JSON.stringify({});

  return { data, usage: response.usageMetadata };
}
