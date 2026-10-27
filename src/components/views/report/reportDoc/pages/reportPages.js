// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

// Shared injection keys for the report document.
//
// `ReportDoc` provides a page registry under this key and `BasePage`
// consumes it to auto-number each page in document order. Pages are composed
// declaratively (and may be repeated), so the number must be derived at runtime
// rather than hard-coded on each page.
export const REPORT_PAGES_KEY = Symbol("report-pages");

// `ReportGenerated` provides the app version under this key and `BasePage`
// consumes it to stamp each page footer.
export const APP_VERSION_KEY = Symbol("app-version");
