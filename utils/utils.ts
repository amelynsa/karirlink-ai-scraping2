import { readFile } from "fs/promises";
import { Browser } from "puppeteer";
import xlsx from "xlsx";
import { getNextButton } from "../ai/ai.ts";
import * as fs from "fs";
import readline from "readline";
import { isElementDisabled } from "../helpers/helpers.js";
import { type Result } from "../types/interface.js";

const MAX_RETRY = 3;

export async function getDOMBody(
  browser: Browser,
  url: string,
  pageLimit?: number
): Promise<Result> {
  const page = await browser.newPage();
  let allBodyElements: string[] = [];
  let usageToken: object[] = [];

  try {
    for (let i = 0; i < MAX_RETRY; i++) {
      try {
    await page.goto(url, {
          waitUntil: "networkidle2",
        });
      } catch (error) {
        if (i === MAX_RETRY) {
          throw error;
        }
        continue;
      }
    }

    // const body = await page.$eval("body", (el) => el.innerHTML);
    const isBodyReady = await page.waitForFunction(
      () => document.body !== null
    );

    let body = "";
    if (isBodyReady) {
      body = await page.$eval("body", (el) => el.innerHTML);
    }

    // let nextPageNavigator;
    let nextBtnSelector;
    // const stream = fs.createWriteStream("./storage/test-get-all.jsonl", {
    //   flags: "a",
    // });
    if (body) {
      // console.log("Write first html body to stream...");
      // stream.write(`${JSON.stringify({ htmlBody: body })}\n`);
      allBodyElements.push(body);
      const { success, data } = await getNextButton(body);
      if (success) {
        usageToken.push(data?.usage || {});
        nextBtnSelector = JSON.parse(data?.content)?.btnIdentifier || "";
        console.log("Next page selector: ", nextBtnSelector);
      }
    }

    let pageCounter = 1;
    while (true) {
      if (!nextBtnSelector) {
        break;
      }
      const nextPageNavigator = await page
        .waitForSelector(nextBtnSelector)
        .catch(() => null);

      if (!nextPageNavigator) {
        break;
      }

      // let isButton = await nextPageNavigator?.evaluate(
      //   (el) => el.tagName === "BUTTON"
      // );

      // if (isButton) {
      //   const isDisabled: boolean =
      //     (await nextPageNavigator?.evaluate(
      //       (button) => (button as HTMLButtonElement).disabled
      //     )) || true;

      //   if (isDisabled) {
      //     break;
      //   }
      // }

      const isDisabled = await isElementDisabled(nextPageNavigator);
      if (isDisabled) break;

      await Promise.all([
        page.waitForNavigation().catch(() => null),
        nextPageNavigator?.click(),
      ]);

      pageCounter++;
      if (pageLimit && pageCounter > pageLimit) {
        break;
      }

      const isNextBodyReady = await page.waitForFunction(
        () => document.body !== null
      );

      let nextBody = "";
      if (isNextBodyReady) {
        nextBody = await page.$eval("body", (el) => el.innerHTML);
      }

      if (nextBody) {
        // console.log("Write stream to file...");
        // stream.write(`${JSON.stringify({ htmlBody: nextBody })}\n`);
        allBodyElements.push(nextBody);
        const { success, data } = await getNextButton(
          nextBody,
          nextBtnSelector
        );

        if (success) {
          usageToken.push(data?.usage || {});
          nextBtnSelector = JSON.parse(data?.content)?.btnIdentifier || "";
          console.log("Next page selector: ", nextBtnSelector);
        }
      }
    }

    return { data: allBodyElements, usage: usageToken };
  } catch (error: any) {
    console.error(error);
    return { data: allBodyElements, usage: usageToken };
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
