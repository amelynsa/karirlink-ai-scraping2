export interface ScraperOptions {
  headlessBrowser?: boolean;
  maxPagesPerSource?: number; // if omitted or zero, no page limit
  maxJobDetailsNavigatorPerPage?: number; //if omitted or zero, no limit
  includeCompanyFromSource?: string | string[]; // which company(s) to be scraped if any. Use array if multiple company.
}
