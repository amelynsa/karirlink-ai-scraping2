import { writeFile, mkdir, readFile } from "fs/promises";
import { extractData } from "./ai/ai.ts";
import {
  getDOMBody,
  readSourcesFromExcel,
  sumTotalUsageToken,
} from "./utils/utils.ts";
import puppeteer from "puppeteer";

const startTime = process.hrtime.bigint();
const timer = setInterval(() => {
  const elapsedSec = Number(process.hrtime.bigint() - startTime) / 1e9;
  const minutes = Math.floor(elapsedSec / 60);
  const seconds = Math.floor(elapsedSec % 60);
  process.stdout.write(
    `\rElapsed: ${minutes}:${seconds.toString().padStart(2, "0")} (m:ss)`
  );
}, 1000); // Update every 1 second

async function main() {
  const browser = await puppeteer.launch();
  try {
    const rows = readSourcesFromExcel("./storage/source.xlsx");

    let extractedData: any[] = [];
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
  }
}

console.time("Process finished in: ");
console.log("Process starting...");
await main();
clearInterval(timer);
