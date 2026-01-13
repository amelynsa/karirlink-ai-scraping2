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
