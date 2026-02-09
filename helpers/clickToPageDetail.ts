import type { Page } from "puppeteer";

export async function clickToPageDetail(page: Page, selector: string) {
  const oldUrl = page.url();
  const pagesBefore = await page.browser().pages();

  await Promise.all([
    page.waitForNavigation().catch(() => null),
    page.click(selector),
  ]);

  const pagesAfter = await page.browser().pages();

  if (pagesAfter.length > pagesBefore.length) {
    return pagesAfter.find((p) => !pagesBefore.includes(p));
  }

  if (page.url() !== oldUrl) {
    await page
      .waitForNavigation({ waitUntil: "networkidle2" })
      .catch(() => null);
    return page;
  }

  return page; // SPA update
}
