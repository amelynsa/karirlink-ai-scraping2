import { type ResponseData } from "../types/interface.js";
import { client } from "./aiconfig.ts";
import { pageDetailSelectorJSONSchema } from "../schema/pageDetailSelectorSchema.ts";

export async function getPageDetailSelector(
  rawData: string,
  selectMax?: number,
): Promise<ResponseData> {
  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
      You have to identify every element that navigate to each job page detail from the following raw HTML content: ${rawData}, if there is any.
     
      You have to determine the most proper SELECTOR for the element that is used to navigate to a job page.
      
      RULES:
      - PRIORITIZE ONLY including selector for job listing that is still ACTIVE, 
      - A job listing is ACTIVE if:
        - There is content in the page that explicitly states that the job is "active", "open", "available", or equivalent phrase / statement.
        - There is NO indication that the job has expired.
        - AND either:
          - No expiration / closing / end date is provided, OR
          - The expiration / closing / end date is in the future relative to the current date(${Date.now()}).
      - A job listing is NOT ACTIVE if:
        - There is content in the page that explicitly states that the job is "expired", "closed", "no longer available", "apply before" or equivalent phrase / statement.
        - OR an "expiration" / "closing" / "end date" / "apply before" or any equivalent phrase / statement date is provided and that date is earlier than the current date(${Date.now()}).
      - If a job is ACTIVE, return the selector as specified in the schema.
      - If a job is NOT ACTIVE, EXCLUDE it, do not include it in the list.
      - If the expiration status cannot be determined from the page content, treat the job as ACTIVE, and return the selector as specified in the schema.
      - Must be VALID selector for CSS only or VALID URL according to the instruction in the schema description.
      - If found, Return a list of selectors according to the provided json schema${selectMax ? ` with maximum of ${selectMax}` : ""}.
      - else, EXCLUDE it, do not include it in the list.
      `,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: pageDetailSelectorJSONSchema,
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
