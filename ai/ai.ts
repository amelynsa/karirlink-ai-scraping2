import { jsonSchema, nextBtnJsonSchema } from "../schema/schema.js";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
import { type ResponseData } from "../types/interface.js";
import z from "zod";
import { jobSchema } from "../schema/jobSchema.ts";

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

      RULES:
      - PRIORITIZE ONLY including job listing that is still ACTIVE, 
      - A job listing is ACTIVE if:
        - There is content in the page that explicitly states that the job is "active", "open", "available", or equivalent phrase / statement.
        - There is NO indication that the job has expired.
        - AND either:
          - No expiration / closing / end date is provided, OR
          - The expiration / closing / end date is in the future relative to the current date(${Date.now()}).
      - A job listing is NOT ACTIVE if:
        - There is content in the page that explicitly states that the job is "expired", "closed", "no longer available", or equivalent phrase / statement.
        - OR an expiration / closing / end date is provided and that date is earlier than the current date(${Date.now()}).
      - If a job is ACTIVE, return it as specified in the schema.
      - If a job is NOT ACTIVE, EXCLUDE it, do not include it in the list.
      - If the expiration status cannot be determined from the page content, treat the job as ACTIVE, and return it as specified in the schema.
      For salary, you have to decide between 3 options specified below:
      1) an object, { "type": "hourly" | "daily" | "monthly" | "yearly" | "fixed". (Fixed salary amount, may represent hourly, daily, monthly or yearly salary. If you can not infer between the four, then just put "fixed".), 
        "amount": The amount of the salary }
      2) an object, { "type": "range" (Salary in certain range), min: The lower limit, max: The upper limit }
      3) empty string "" (salary info not provided)

      - If you cannot extract meaningful job listing data from the page content, EXCLUDE it, do not include it in the list.
      - Else, Return the job listing data in JSON format ONLY as specified by the schema.
      `,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: z.toJSONSchema(z.array(jobSchema)),
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
  initialSelector: string = "",
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
}
