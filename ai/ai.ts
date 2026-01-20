import { jsonSchema, nextBtnJsonSchema } from "../schema/schema.js";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
import { type ResponseData } from "../types/interface.js";

dotenv.config();

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function extractData(rawData: string): Promise<ResponseData> {
  try {
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

    const responseData = response.text || JSON.stringify([]);

    return {
      success: true,
      message: "AI Finished the task.",
      data: { content: responseData, usage: response.usageMetadata },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      data: { error: error },
    };
  }
}

export async function getNextButton(
  rawData: string,
  initialSelector: string = ""
): Promise<ResponseData> {
  try {
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

    const responseData = response.text || JSON.stringify({});

    return {
      success: true,
      message: "AI Finished the task.",
      data: { content: responseData, usage: response.usageMetadata },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      data: { error: error },
    };
  }
/**
 * Mengubah HTML mentah menjadi data lowongan kerja terstruktur (JSON)
 */
export async function extractData2(rawData: string) {
  // Jika HTML kosong, langsung return array kosong
  if (!rawData || rawData.trim() === "") {
    return { data: JSON.stringify([]), usage: {} };
  }

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
You are an information extraction system.

TASK:
Extract ONLY job listing information from the raw HTML below.

RULES:
- Only extract real job listings (positions / vacancies).
- Ignore navigation menus, headers, footers, banners, and unrelated text.
- Output MUST follow the provided JSON schema.
- Output MUST be an array of job objects.
- If salary information is not found, use:
  { "type": "not specified" }
- For missing text fields, use empty string "".
- If no job listings are found, return an empty JSON array [].

RAW HTML:
${rawData}
    `,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: jsonSchema,
    },
  });

  const data = response.text && response.text.trim() !== ""
    ? response.text
    : JSON.stringify([]);

  return {
    data,
    usage: response.usageMetadata || {},
  };
}
