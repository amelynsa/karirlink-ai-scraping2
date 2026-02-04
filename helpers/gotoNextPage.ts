import type { Page } from "puppeteer";
import { isElementDisabled } from "./helpers.ts";

export async function gotoNextPage(page: Page, selector: string = "") {
  try {
    if (!selector) {
      throw new Error("No selector provided.");
    }

    const nextPageNavigator = await page
      .waitForSelector(selector)
      .catch(() => null);

    if (!nextPageNavigator) {
      throw new Error("Element with the specified selector not found.");
    }

    const isDisabled = await isElementDisabled(nextPageNavigator);
    if (isDisabled) throw new Error("Element is disabled/unclickable.");

    await Promise.all([
      page.waitForNavigation().catch(() => null),
      nextPageNavigator?.click(),
    ]);
  } catch (error: any) {
    throw error;
  }
}
