import z from "zod";

const jobSchema = z.object({
  title: z
    .string()
    .optional()
    .default("")
    .describe(
      "Name of the job position. If not found, return ONLY empty string.",
    ),
  company: z
    .string()
    .optional()
    .default("")
    .describe(
      "Name of the company that opened the job listing. If not found, return ONLY empty string.",
    ),
  location: z
    .string()
    .optional()
    .default("")
    .describe(
      "Location of where the job takes place. If not found, return ONLY empty string.",
    ),
  salary: z.xor([
    z.object({
      type: z
        .enum(["hourly", "daily", "monthly", "yearly", "fixed"])
        .describe(
          'Fixed salary amount, may represent hourly, daily, monthly or yearly salary. If you can not infer between the four, then just put "fixed".',
        )
        .default("fixed"),
      amount: z.number().default(0),
    }),
    z.object({
      type: z
        .literal("range")
        .describe(
          "Salary amount in range, with range from minimum to maximum amount.",
        ),
      min: z.number().default(0),
      max: z.number().default(0),
    }),
    z.literal("").describe("Salary information is not provided."),
  ]),
  job_type: z
    .enum(["full-time", "part-time", "contract", "internship", ""])
    .default(""),
  description: z
    .string()
    .optional()
    .default("")
    .describe(
      "Detailed description of the job, including responsibilities and requirements. If not found, return ONLY empty string.",
    ),
  posting_date: z
    .string()
    .optional()
    .default("")
    .describe(
      "The date the job listing was posted. Return ONLY VALID date string with format DD/MM/YYYY. If not found, return ONLY empty string.",
    ),
  end_date: z
    .string()
    .optional()
    .default("")
    .describe(
      "The date the job listing ends or expire. Return ONLY VALID date string with format DD/MM/YYYY. If not found, return ONLY empty string.",
    ),
  url: z
    .url()
    .optional()
    .default("")
    .describe(
      "The URL of the job listing. Must be VALID URL (https://...) If not found, return ONLY empty string.",
    ),
});

export const jobJsonSchema = z.toJSONSchema(jobSchema);
