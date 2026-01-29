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
    error_data: data.success ? "" : JSON.stringify(data?.data?.error || {}),
    nama_perusahaan: (data.success && data?.data?.company) || "",
    posisi: (data.success && data?.data?.title) || "",
    kategori_pekerjaan: (data.success && data?.data?.jobCategory) || "",
    tipe_pekerjaan: (data.success && data?.data?.job_type) || "",
    lokasi: (data.success && data?.data?.location) || "",
    job_description: (data.success && data?.data?.description) || "",
    requirement: (data.success && data?.data?.requirement) || "",
    salary_type:
      data.success && data?.data?.salary && data?.data?.salary?.type
        ? data?.data?.salary?.type
        : "",
    salary_min: 0,
    salary_max: 0,
    posting_date: (data.success && data?.data?.posting_date) || "",
    end_date: (data.success && data?.data?.end_date) || "",
    url: (data.success && data?.data?.url) || "",
  };

  if (data.success && data.data?.salary) {
    if (data.data.salary.type === "range") {
      csvData.salary_min = data.data.salary.min;
      csvData.salary_max = data.data.salary.max;
    } else {
      csvData.salary_max = data.data.salary.amount;
    }
  }
  return csvData;
}
