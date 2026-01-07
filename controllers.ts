import puppeteer from "puppeteer";

export async function getDOMBody(url: string): Promise<string> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  const body = await page.$eval("body", (el) => el.innerHTML);

  await browser.close();
  return body;
}
