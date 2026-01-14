import { extractData } from "./ai/ai.ts";
import {
  getDOMBody,
  readSourcesFromExcel,
  sumTotalUsageToken,
} from "./utils/utils.ts";
import puppeteer from "puppeteer";
import * as fs from "fs";
import { safeParseJSONArrayData } from "./helpers/helpers.ts";

const LOG_FILE_PATH = "./logs/usage-log.jsonl";
const RESULT_FILE_PATH = "./storage/test-result.jsonl";

async function main() {
  const browser = await puppeteer.launch();

  if (fs.existsSync(LOG_FILE_PATH)) {
    fs.truncateSync(LOG_FILE_PATH, 0);
  }
  if (fs.existsSync(RESULT_FILE_PATH)) {
    fs.truncateSync(RESULT_FILE_PATH, 0);
  }
  const streamUsageLog = fs.createWriteStream(LOG_FILE_PATH, {
    flags: "a",
  });
  const streamExtractedData = fs.createWriteStream(RESULT_FILE_PATH, {
    flags: "a",
  });

  try {
    console.log("Reading sources...");
    const rows = readSourcesFromExcel("./storage/source-10.xlsx");

    let extractedData: Object[] = [];
    let usageData: any[] = [];

    console.log("Extracting data from sources...\n");
    for (const row of rows) {
      console.log(`Getting raw HTML body from: ${row.karirURL}...`);
      const { data, usage } = await getDOMBody(browser, row.karirURL || "", 2);
      console.log(`Writing usage log to write stream from getDOMBODY`);
      if (usage.length > 0) {
        usage.forEach((value) => {
          streamUsageLog.write(`${JSON.stringify(value)}\n`);
        });
      }

      console.log(
        `AI is extracting and parsing data from HTML body of: ${row.karirURL}...`
      );
      for (const [index, raw] of data.entries()) {
        const { success, message, data } = await extractData(raw);
        await new Promise((resolve) => setTimeout(resolve, 15000));
        if (success) {
          usageData.push(usage || {});
          extractedData.push(...safeParseJSONArrayData(data?.content));

          if (data?.usage) {
            console.log(`(${index + 1}) Writing usage log to write stream`);
            streamUsageLog.write(`${JSON.stringify(data?.usage)}\n`);
          }
          if (
            safeParseJSONArrayData(data?.content) instanceof Array &&
            safeParseJSONArrayData(data?.content).length > 0
          ) {
            console.log(
              `(${index + 1}) Writing extracted data to write stream`
            );
            JSON.parse(data?.content).forEach((value: any) => {
              const writeResponse = {
                success,
                message,
                data: value,
              };

              streamExtractedData.write(`${JSON.stringify(writeResponse)}\n`);
            });
          }
        } else {
          console.log("Writing extracted data to write stream");
          const writeResponse = {
            success,
            message,
            data: data?.error,
          };
          streamExtractedData.write(`${JSON.stringify(writeResponse)}\n`);
        }
      }
      console.log(
        `AI finished extracting and parsing from HTML body of: ${row.karirURL}\n`
      );
    }
    console.log("Finished extracting data from all sources");
    console.log(`Total successful extracted data: ${extractedData.length}`);

    console.log("Counting total extraction usage token...");
    await sumTotalUsageToken("./logs/usage-log.jsonl");
    console.log();
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser.close();
  }
}

console.time("Process finished in: ");
console.log("Process starting...");
await main();
// await sumTotalUsageToken("./logs/usage-log.jsonl");
console.timeEnd("Process finished in: ");
