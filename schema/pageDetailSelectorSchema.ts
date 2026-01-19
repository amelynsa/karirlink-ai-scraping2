import z from "zod";

const pageDetailSelectorSchema = z.object({
  selector: z
    .string()
    .optional()
    .default("")
    .describe(
      `
        CSS selector that identifies the clickable element used to open the job detail page,

        OR,

        Valid URL that navigates to the job detail page.

        You have to prioritize getting the Valid URL first before getting CSS selector, according to rules and examples below.

        Rules:
        IF CSS selector
        - Must be a VALID CSS selector only (NO XPath, NO JavaScript).
        - Must match exactly ONE element.
        - Use positional selectors (e.g. :nth-of-type(), :nth-child()) when necessary.
        - The element may be an <a>, <button>, or any clickable element.
        - The element may or may not have an href attribute (navigation may be handled by JavaScript).
        - Do NOT rely on JavaScript behavior; select based on DOM structure only.
        - If multiple selectors are needed, combine them using valid CSS syntax (e.g. ".job-card a", ".detail-btn, .job-link").
        - Do NOT return explanations, comments, or code.
        - If no suitable selector exists, return an empty string "".

        IF a URL
        - Must be VALID URL format that match exactly to ONE job detail.
        - Must be specific, contains the protocol "https://...", the company career page domain name, the path params(if any), and the query params(if any).
        - If you cannot accomplish the rule above, then get the CSS selector instead. 
        - If no valid URL exists, return an empty string "".

        Examples:
        IF CSS Selector
        - ".this-link:nth-of-type(2)"
        - ".job-card:nth-child(3) a"
        - "ul.jobs > li:nth-child(5) a"
        - etc

        IF a URL
        - "https://careers.shopee.co.id/job-detail/J02065862/"
        - "https://careers.othercompany.com/..."

      `,
    ),
});

export const pageDetailSelectorJSONSchema = z.toJSONSchema(
  z.array(pageDetailSelectorSchema),
);
