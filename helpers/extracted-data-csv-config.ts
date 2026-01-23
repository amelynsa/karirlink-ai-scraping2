import { format } from "fast-csv";

export const csvStream = format({
  headers: [
    "success",
    "message",
    "errorData",
    "title",
    "company",
    "location",
    "salary",
    "salaryType",
    "salaryMin",
    "salaryMax",
    "jobType",
    "jobDescription",
    "postingDate",
    "endDate",
    "url",
  ],
  quoteColumns: true,
  quoteHeaders: true,
  writeBOM: true,
});
