import { extractData, getNextButton } from "./ai/ai.ts";
import { readSourcesFromExcel, sumTotalUsageToken } from "./utils/utils.ts";
import puppeteer, { Page } from "puppeteer";
import * as fs from "fs";
import {
  isElementDisabled,
  safeParseJSON,
  safeParseJSONArrayData,
} from "./helpers/helpers.ts";
import { getDOMBody } from "./utils/getDOMBody.ts";
import { getPageDetailSelector } from "./ai/getPageDetailSelector.ts";
import { extractPageDetailData } from "./ai/extractPageDetailData.ts";
import { clickToPageDetail } from "./helpers/clickToPageDetail.ts";
import { gotoNextPage } from "./helpers/gotoNextPage.ts";
import z from "zod";
import { setTimeout } from "timers/promises";
import { detailpagehtml } from "./storage/test-html.ts";
import { isResponseObjectValuesEmpty } from "./helpers/isResponseObjectValuesEmpty.ts";
import type { ScraperOptions } from "./types/ScraperOptions.ts";

const LOG_FILE_PATH = "./logs/usage-log.jsonl";
const RESULT_FILE_PATH = "./storage/test-result.jsonl";

async function runScraper(
  resultFilepath: string = RESULT_FILE_PATH,
  usageLogFilepath: string = LOG_FILE_PATH,
  options: ScraperOptions = {
    maxJobDetailsNavigatorPerPage: 3,
    maxPagesPerSource: 2,
  },
) {
  const {
    includeCompanyFromSource,
    maxJobDetailsNavigatorPerPage,
    maxPagesPerSource,
  } = options;
  const included: string[] = [];
  if (includeCompanyFromSource && Array.isArray(includeCompanyFromSource)) {
    included.push(...includeCompanyFromSource);
  } else if (
    includeCompanyFromSource &&
    typeof includeCompanyFromSource === "string"
  ) {
    included.push(includeCompanyFromSource);
  }

  const browser = await puppeteer.launch();

  if (fs.existsSync(usageLogFilepath)) {
    fs.truncateSync(usageLogFilepath, 0);
  }
  if (fs.existsSync(resultFilepath)) {
    fs.truncateSync(resultFilepath, 0);
  }
  const streamUsageLog = fs.createWriteStream(usageLogFilepath, {
    flags: "a",
  });
  const streamExtractedData = fs.createWriteStream(resultFilepath, {
    flags: "a",
  });

  try {
    console.log("Reading sources...");
    const rows = readSourcesFromExcel("./storage/source-10.xlsx");

    let extractedData: Object[] = [];
    let usageData: any[] = [];

    console.log("Extracting data from sources...\n");
    for (const row of rows) {
      if (!included.includes(row.perusahaan)) {
        console.log("Skipped.");
        continue;
      }
      console.log(`Getting job listings data from: ${row.karirURL}...`);
      const page = await browser.newPage();
      for (let i = 0; i < 3; i++) {
        try {
          await page.goto(row.karirURL, {
            waitUntil: "networkidle2",
          });
        } catch (error: any) {
          if (i === 3) {
            throw error;
          }
          console.error(error.message);
          console.log(`Retrying...(${i})`);
          // continue;
        }
      }

      /* while true
            get dom from row URL
            get selector for each job detail (not url since not everything uses url) from the dom
            write stream usage data to file
            for detail in details, 
              if no element selected then continue
              if unclickable then continue
              navigate to detail page
              get dom again
              extract data from body
              write stream usage data to file
              write stream job data to file
              push to extractedData array
              timeout 30s
              close page ??
            get next selector from dom
            write stream usage data to file
            if no next selector then break
            if no element selected then break
            if unclickable then break
            navigate to next page
          finished while
          close page
        */
      let jobListDetails: any[] = [];
      let pageCounter = 1;
      while (true) {
        let prevUrl = page.url();
        let rawBody = "";
        try {
          rawBody = await getDOMBody(page);
          const { success, data } = await getPageDetailSelector(
            rawBody,
            maxJobDetailsNavigatorPerPage,
          );
          if (success) {
            console.log(
              `(Page: ${pageCounter}) Writing usage log to write stream from getPageDetailSelector`,
            );
            streamUsageLog.write(`${JSON.stringify(data?.usage)}\n`);
            const details: any[] = JSON.parse(data?.content) || [];

            for (const [index, detail] of details.entries()) {
              const toPageDetailSelector = detail.selector;
              if (!toPageDetailSelector) {
                // throw new Error("No page detail navigation selector.");
                continue;
              }
              const urlSchema = z.url();

              console.log(`  (${index + 1}) Origin URL :`, prevUrl);
              console.log(`  (${index + 1}) Actual URL :`, page.url());
              let detailPage: Page | undefined;

              if (urlSchema.safeParse(detail.selector).success) {
                console.log(
                  `  (${index + 1}) Page detail URL : ${detail.selector}`,
                );
                detailPage = await browser.newPage();
                console.log(`  (${index + 1}) Navigating to page detail...`);
                await detailPage?.goto(detail.selector);
              } else {
                console.log(
                  `  (${index + 1}) Page detail selector :`,
                  toPageDetailSelector,
                );

                const toPageDetail = await page
                  .waitForSelector(toPageDetailSelector)
                  .catch(() => null);

                if (!toPageDetail) {
                  // throw new Error("No page detail navigation element.");
                  continue;
                }

                const isDisabled = await isElementDisabled(toPageDetail);
                if (isDisabled) {
                  // throw new Error("Page detail navigation element is disabled.");
                  continue;
                }
                console.log(`  (${index + 1}) Navigating to page detail...`);

                detailPage = await clickToPageDetail(
                  page,
                  toPageDetailSelector,
                );
              }
              console.log(
                `  (${index + 1}) On page detail : ${detailPage?.url()}`,
              );

              // await Promise.all([
              //   page.waitForNavigation().catch(() => null),
              //   toPageDetail?.click(),
              // ]);

              const rawDetailBody = detailPage
                ? await getDOMBody(detailPage)
                : "";
              if (rawDetailBody) {
                console.log(
                  `  (${
                    index + 1
                  }) AI is extracting job detail data from raw detail page...`,
                );
                const { success, message, data } =
                  await extractPageDetailData(rawDetailBody);
                await setTimeout(30000);
                if (success) {
                  const jobDetailData: any = safeParseJSON(data?.content);
                  if (!isResponseObjectValuesEmpty(jobDetailData)) {
                    extractedData.push(jobDetailData);
                    jobListDetails.push(jobDetailData);
                    const writeResponse = {
                      success,
                      message,
                      data: { ...jobDetailData, url: detailPage?.url() },
                    };
                    console.log(
                      `  (${
                        index + 1
                      }) Writing extracted page detail data to write stream`,
                    );
                    streamExtractedData.write(
                      `${JSON.stringify(writeResponse)}\n`,
                    );
                  } else {
                    console.log(`  (${index + 1}) Job listing data is empty`);
                  }
                  console.log(
                    `  (${
                      index + 1
                    }) Writing usage log data to write stream from extracting page detail`,
                  );
                  streamUsageLog.write(`${JSON.stringify(data?.usage)}\n`);
                } else {
                  console.log(`(${index + 1}) Error:\n${data.error}`);
                }
              }
              // console.log(detailPage?.url());
              // console.log(page.url());

              if (detailPage !== page) {
                await detailPage?.close();
              }
              await page.goto(prevUrl, { waitUntil: "networkidle2" });
            }
            if (!jobListDetails.length) {
              console.log(jobListDetails.length);
              throw new Error("No job detail list added.");
            }
          } else {
            throw data.error;
          }
        } catch (error) {
          console.error(error);
          if (rawBody) {
            const { success, message, data } = await extractData(rawBody);
            if (success) {
              const jobData: any[] = safeParseJSON(data?.content) || [];
              extractedData.push(...jobData);
              jobData.forEach((job) => {
                const writeResponse = {
                  success,
                  message,
                  data: job,
                };
                console.log(
                  `Writing extracted data from rawBody to write stream`,
                );
                streamExtractedData.write(`${JSON.stringify(writeResponse)}\n`);
              });

              console.log(`Writing usage log data to write stream`);
              streamUsageLog.write(`${JSON.stringify(data?.usage)}\n`);
            }
          }
        }

        if (
          maxPagesPerSource &&
          pageCounter &&
          pageCounter >= maxPagesPerSource
        ) {
          console.log("Reached max page.");
          break;
        }
        const { success, data } = await getNextButton(rawBody);
        if (success) {
          console.log(
            `Writing usage log data to write stream from getNextButton`,
          );
          streamUsageLog.write(`${JSON.stringify(data?.usage)}\n`);
          const nextBtnSelector =
            JSON.parse(data?.content)?.btnIdentifier || "";

          try {
            await gotoNextPage(page, nextBtnSelector);
            pageCounter++;
          } catch (error: any) {
            console.error(error);
            break;
          }
        } else {
          break;
        }

        // end point for traversing a company career page
      } // end while
      await page.close();
      console.log();
    } // this is the end for loop of rows
    // cleane(extractdata)

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
await runScraper(RESULT_FILE_PATH, LOG_FILE_PATH, {
  includeCompanyFromSource: ["Bank Mandiri", "Bank BRI"],
  maxJobDetailsNavigatorPerPage: 0,
  maxPagesPerSource: 1,
});

// await sumTotalUsageToken("./logs/usage-log.jsonl");
console.timeEnd("Process finished in: ");
