import type { Row } from "@fast-csv/format";
import type { CsvFormatterStream } from "fast-csv";
import fs from "fs";
import { extractedDataToCSVRow, type Data } from "./extractedDataToCSVRow.ts";

export function handleScrapingError(
  csvStream: CsvFormatterStream<Row, Row>,
  writeStream: fs.WriteStream,
  response: Data,
  extractedData: Array<unknown>,
) {
  const writeResponse = {
    success: false as false,
    message: response.message,
    data: { error: !response.success ? response.data?.error : undefined },
  };
  extractedData.push(writeResponse);
  if (writeStream) writeStream.write(`${JSON.stringify(writeResponse)}\n`);
  const csvRow = extractedDataToCSVRow(writeResponse);
  csvStream.write(csvRow);
}
