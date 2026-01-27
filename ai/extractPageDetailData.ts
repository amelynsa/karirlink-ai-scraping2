import { object, safeParse } from "zod";
import { jobJsonSchema } from "../schema/jobSchema.ts";
import type { ResponseData } from "../types/interface.ts";
import { client } from "./aiconfig.ts";
import { safeParseJSON } from "../helpers/helpers.ts";

export async function extractPageDetailData(
  rawData: string,
): Promise<ResponseData> {
  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
      You have to extract job listing data from the following raw HTML content: ${rawData}.
      Extract relevant information according to the provided JSON schema for the job listing.

      RULES:
      - PRIORITIZE ONLY including job listing that is still ACTIVE, 
      - A job listing is ACTIVE if:
        - There is NO indication that the job has expired.
        - AND either:
          - No expiration / closing / end date is provided, OR
          - The expiration / closing / end date is in the future relative to the current date(${Date.now()}).
      - A job listing is NOT ACTIVE if:
        - There is content in the page that explicitly states that the job is "expired", "closed", "no longer available", "apply before" or equivalent phrase / statement.
        - OR an "expiration" / "closing" / "end date" / "apply before" or any equivalent phrase / statement date is provided and that date is earlier than the current date(${Date.now()}).
      - If a job is ACTIVE, return it as specified in the schema.
      - If a job is NOT ACTIVE, return ONLY empty string.
      - If the expiration status cannot be determined from the page content, treat the job as ACTIVE, and return it as specified in the schema.
      - For salary, you have to decide between 3 options specified below:
        1) an object, { "type": "hourly" | "daily" | "monthly" | "yearly" | "fixed". (Fixed salary amount, may represent hourly, daily, monthly or yearly salary. If you can not infer between the four, then just put "fixed".), 
            "amount": The amount of the salary }
        2) an object, { "type": "range" (Salary in certain range), min: The lower limit, max: The upper limit }
        3) empty string "" (salary info not provided)
      - If you cannot extract meaningful job listing data from the page content, return ONLY empty string.
      - Else, Return the job listing data in JSON format ONLY as specified by the schema.
      `,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: jobJsonSchema,
      },
    });

    const responseData = response.text || "";

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
