import { readFile } from "fs/promises";
import { Browser } from "puppeteer";
import xlsx from "xlsx";

export async function getDOMBody(
  browser: Browser,
  url: string
): Promise<string> {
  const page = await browser.newPage();
  try {
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });

    const body = await page.$eval("body", (el) => el.innerHTML);

    await page.close();
    return body;
  } catch (error: any) {
    console.error("\n", error.message);
    return "";
  } finally {
    await page.close();
  }
}

export function readSourcesFromExcel(path: string) {
  const workbook = xlsx.readFile(path);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rows: any[] = xlsx.utils.sheet_to_json(sheet);

  return rows;
}

export async function sumTotalUsageToken(path: string) {
  const stream = fs.createReadStream(path);

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  const results = [];

  for await (const line of rl) {
    if (!line.trim()) continue;
    results.push(JSON.parse(line));
  }

  const totalTokens = results.reduce(
    (sum, item) => sum + (item.totalTokenCount || 0),
    0
  );
  console.log(`Total tokens used: ${totalTokens}`);
}
