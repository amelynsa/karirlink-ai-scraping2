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
      Must be VALID selector for CSS only or VALID URL according to the instruction in the schema description.
      
      If found, Return a list of selectors according to the provided json schema${selectMax ? ` with maximum of ${selectMax}` : ""}.
      else, return ONLY empty string "".
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
