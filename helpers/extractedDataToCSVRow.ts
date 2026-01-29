import { jobSchema } from "../schema/jobSchema.ts";
import z, { success } from "zod";

type SuccessData = {
  success: true;
  message: string;
  data?: z.infer<typeof jobSchema>;
};

type ErrorData = {
  success: false;
  message: string;
  data?: { error?: Object };
};

export type Data = SuccessData | ErrorData;

export function extractedDataToCSVRow(data: Data): Record<string, any> {
  const csvData = {
    timestamp: new Date().toISOString(),
    success: data.success,
    message: data.message,
    errorData: data.success ? "" : JSON.stringify(data?.data?.error || {}),
    title: (data.success && data?.data?.title) || "",
    company: (data.success && data?.data?.company) || "",
    location: (data.success && data?.data?.location) || "",
    salary:
      data.success && data?.data?.salary && data?.data?.salary?.type !== "range"
        ? data?.data?.salary?.amount
        : "",
    salaryType:
      data.success && data?.data?.salary && data?.data?.salary?.type
        ? data?.data?.salary?.type
        : "",
    salaryMin:
      data.success && data?.data?.salary && data?.data?.salary?.type === "range"
        ? data?.data?.salary?.min
        : "",
    salaryMax:
      data.success && data?.data?.salary && data?.data?.salary?.type === "range"
        ? data?.data?.salary?.max
        : "",
    jobType: (data.success && data?.data?.job_type) || "",
    jobDescription: (data.success && data?.data?.description) || "",
    postingDate: (data.success && data?.data?.posting_date) || "",
    endDate: (data.success && data?.data?.end_date) || "",
    url: (data.success && data?.data?.url) || "",
  };

  return csvData;
}
