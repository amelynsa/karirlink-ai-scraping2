import type { Row } from "@fast-csv/format";
import type { CsvFormatterStream } from "fast-csv";
import fs from "fs";
import { extractedDataToCSVRow, type Data } from "./extractedDataToCSVRow.ts";

export function handleScrapingSuccess(
  csvStream: CsvFormatterStream<Row, Row>,
  writeStream: fs.WriteStream,
  response: Data,
  extractedData: Array<unknown>,
) {
  const writeResponse = {
    success: true as true,
    message: response.message,
    data: response.success ? response.data : undefined,
  };
  extractedData.push(writeResponse);
  writeStream.write(`${JSON.stringify(writeResponse)}\n`);
  const csvRow = extractedDataToCSVRow(writeResponse);
  csvStream.write(csvRow);
}
