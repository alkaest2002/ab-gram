// Shared injection key for the report's page counter.
//
// `ReportDoc` provides a page registry under this key and `BasePageLayout`
// consumes it to auto-number each page in document order. Pages are composed
// declaratively (and may be repeated), so the number must be derived at runtime
// rather than hard-coded on each page.
export const REPORT_PAGES_KEY = Symbol("report-pages");
