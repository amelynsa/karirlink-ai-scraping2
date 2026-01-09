import { z } from "zod";

const jobSchema = z.object({
  title: z.string().optional().default(""),
  company: z.string().optional().default(""),
  location: z.string().optional().default(""),
  salary: z.xor([
    z.object({
      type: z
        .literal("fixed")
        .describe(
          "Fixed salary amount, may represent hourly, daily, monthly or yearly salary."
        ),
      amount: z.number(),
    }),
    z.object({
      type: z.literal("range"),
      min: z.number(),
      max: z.number(),
    }),
    z.object({
      type: z.literal("not specified"),
    }),
  ]),
  job_type: z
    .enum(["full-time", "part-time", "contract", "internship", "not specified"])
    .default("not specified"),
  description: z
    .string()
    .optional()
    .describe(
      "Detailed description of the job, including responsibilities and requirements."
    ),
  posting_date: z.string().optional().default(""),
  end_date: z.string().optional().default(""),
  url: z.url().optional().describe("The URL of the job listing.").default(""),
});

export const jsonSchema = z.toJSONSchema(z.array(jobSchema));

const nextBtnSchema = z.object({
  btnIdentifier: z
    .string()
    .optional()
    .default("")
    .describe(
      "SELECTOR for the next button or link(anchor) element. Can be combination of selectors or specific selector like class or id. Must be VALID selector for CSS only."
    ),
});

export const nextBtnJsonSchema = z.toJSONSchema(nextBtnSchema);
