import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export const argv = yargs(hideBin(process.argv))
  .option("headlessBrowser", {
    alias: "H",
    type: "boolean",
    default: true,
    describe: "Launch browser on headless mode",
  })
  .option("includeCompanyFromSource", {
    alias: "I",
    type: "array",
    string: true,
    describe: "Company names to include",
  })
  .option("maxJobDetailsNavigatorPerPage", {
    alias: "D",
    type: "number",
    default: 3,
    describe: "Max job details per page",
  })
  .option("maxPagesPerSource", {
    alias: "P",
    type: "number",
    default: 2,
    describe: "Max pages to scrape",
  })
  .option("mailto", {
    type: "string",
    default: "",
    describe: "Recipient email of scraped result",
  })
  .help()
  .parse();
