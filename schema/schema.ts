import { z } from "zod";

/**
 * Schema untuk satu data lowongan pekerjaan
 * Digunakan oleh AI Agent untuk validasi output JSON
 */
const jobSchema = z.object({
  title: z.string().optional().default(""),

  company: z.string().optional().default(""),

  location: z.string().optional().default(""),

  salary: z
    .union([
      z.object({
        type: z
          .literal("fixed")
          .describe(
            "Fixed salary amount, may represent hourly, daily, monthly, or yearly salary."
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
    ])
    .default({ type: "not specified" }),

  job_type: z
    .enum(["full-time", "part-time", "contract", "internship", "not specified"])
    .default("not specified"),

  description: z
    .string()
    .optional()
    .describe(
      "Detailed description of the job, including responsibilities and requirements."
    )
    .default(""),

  posting_date: z.string().optional().default(""),

  end_date: z.string().optional().default(""),

  url: z.string().url().optional().default(""),
});

/**
 * JSON Schema yang dikirim ke AI Agent
 * Output AI HARUS berupa array of jobSchema
 */
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
