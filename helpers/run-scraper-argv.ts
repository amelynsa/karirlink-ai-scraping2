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
  .option("maxPagesPerSource", {
    alias: "P",
    type: "number",
    default: 3,
    describe: "Max pages to scrape",
  })
  .option("maxJobDetailsNavigatorPerPage", {
    alias: "D",
    type: "number",
    default: 5,
    describe: "Max job details per page",
  })
  .help()
  .parse();
