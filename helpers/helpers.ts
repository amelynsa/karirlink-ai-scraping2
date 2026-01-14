import { ElementHandle } from "puppeteer";

export function safeParseJSONArrayData(input?: string): any[] {
  if (!input) return [];

  try {
    const parsed = JSON.parse(input);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

export function safeParseJSON<T>(input: string): T | null {
  try {
    return JSON.parse(input) as T;
  } catch {
    return null;
  }
}

export async function isElementDisabled(handle: ElementHandle) {
  return handle.evaluate((el) =>
    el instanceof HTMLInputElement ||
    el instanceof HTMLButtonElement ||
    el instanceof HTMLSelectElement ||
    el instanceof HTMLTextAreaElement ||
    el instanceof HTMLOptionElement ||
    el instanceof HTMLFieldSetElement
      ? el.disabled
      : false
  );
}
