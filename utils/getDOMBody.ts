import type { Browser, Page } from "puppeteer";

export async function getDOMBody(page: Page): Promise<string> {
  try {
    const isBodyReady = await page.waitForFunction(
      () => document.body !== null
    );

    let body = "";
    if (isBodyReady) {
      body = await page.$eval("body", (el) => el.innerHTML);
    }

    return body;
  } catch (error: any) {
    console.error(error);
    return "";
  }
}
