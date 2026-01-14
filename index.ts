import { writeFile, mkdir, readFile } from "fs/promises";
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
    const rows = readSourcesFromExcel("./storage/source.xlsx");

    let extractedData: Object[] = [];
    let usageData: any[] = [];

    for (const [index, row] of rows.entries()) {
      if (index === 5) break;
      const body = await getDOMBody(browser, row.karirURL || "");
      const { data, usage } = await extractData(body);
      usageData.push(usage || {});
      extractedData = [...extractedData, ...JSON.parse(data)];
    }

    await mkdir("./logs", { recursive: true });
    await writeFile(
      "./logs/usage-log.json",
      JSON.stringify(usageData, null, 2)
    );

    await mkdir("./storage", { recursive: true });
    await writeFile(
      "./storage/test-result.json",
      JSON.stringify(extractedData, null, 2)
    );
    await browser.close();
    console.log("\nExtracting job listings done.");
    console.log("\nCounting total extraction usage token...");
    await sumTotalUsageToken();
    process.exit(0);
  } catch (error) {
    console.error("\n", error);
    await browser.close();
    process.exit(1);
  }
}

await main();
clearInterval(timer);
