import { test, expect, Page } from "@playwright/test";

/** Inject auth cookies so the middleware lets us through. */
async function injectAuthCookies(context: any) {
  await context.addCookies([
    { name: "sid", value: "mock-test-session-sid-999", domain: "localhost", path: "/" },
    { name: "user_id", value: "candidate@example.com", domain: "localhost", path: "/" },
    { name: "full_name", value: "Test Candidate", domain: "localhost", path: "/" },
    { name: "system_user", value: "no", domain: "localhost", path: "/" },
    { name: "user_lang", value: "en", domain: "localhost", path: "/" },
  ]);
}

/** Mock the application-form list API to return an application. */
async function mockApplicationState(page: Page, appId: string = "ADM-2026-00120") {
  await page.route("**/api/v1/application-form", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        forms: [
          {
            name: appId,
            docstatus: 1,
            modified: new Date().toISOString(),
            enable_scholarship_form: 0,
            workflow_state: "Offer Letter Accepted",
          },
        ],
      }),
    });
  });
}

/** Mock proxy APIs to avoid external network calls during initialization. */
async function mockSchedulerEndpoints(page: Page) {
  await page.route("**/api/proxy/get_current_interview*", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        message: {
          has_current_interview: false,
        },
      }),
    });
  });

  await page.route("**/api/proxy/get_available_interview_slots*", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        message: {
          available_days: ["2026-07-10"],
          available_dates: ["2026-07-10"],
        },
      }),
    });
  });
}

test.describe("Interview Scheduler Auto-Login and Redirection Routing", () => {

  test("1. Unauthenticated user visiting /schedule should redirect to /login", async ({ page }) => {
    // Navigate directly to /schedule without any authentication cookies
    await page.goto("/schedule");
    
    // Validate redirect to /login
    await expect(page).toHaveURL(/.*\/login/);

    // Verify login form fields are displayed
    await expect(page.locator("input[type='email']")).toBeVisible();
    await expect(page.locator("input[type='password']")).toBeVisible();
    await expect(page.locator("input[placeholder='ADM-2026-00001']")).toBeVisible();
  });

  test("2. Authenticated user visiting /login should automatically retrieve Application ID and redirect to /schedule", async ({ page, context }) => {
    // Setup mock authentication session
    await injectAuthCookies(context);
    await mockApplicationState(page, "ADM-2026-00120");
    await mockSchedulerEndpoints(page);

    // Visit /login
    await page.goto("/login");

    // It should automatically redirect to /schedule
    await expect(page).toHaveURL(/.*\/schedule/);

    // Verify the scheduling page main header or UI loaded first
    await expect(page.locator("text=Admissions Interview")).toBeVisible();

    // Verify Application ID was set in sessionStorage
    const appId = await page.evaluate(() => sessionStorage.getItem("application_id"));
    expect(appId).toBe("ADM-2026-00120");
  });

  test("3. Authenticated user visiting /schedule with empty sessionStorage should recover ID and render schedule page", async ({ page, context }) => {
    // Setup mock authentication session
    await injectAuthCookies(context);
    await mockApplicationState(page, "ADM-2026-00999");
    await mockSchedulerEndpoints(page);

    // Clear sessionStorage on initial load of the browser to simulate empty state
    await page.addInitScript(() => {
      sessionStorage.clear();
    });

    // Go directly to /schedule
    await page.goto("/schedule");

    // It should NOT redirect to /login and remain on /schedule
    await expect(page).toHaveURL(/.*\/schedule/);

    // Verify the scheduling page main header or UI loaded first
    await expect(page.locator("text=Admissions Interview")).toBeVisible();

    // Verify sessionStorage recovered and populated the correct application ID
    const appId = await page.evaluate(() => sessionStorage.getItem("application_id"));
    expect(appId).toBe("ADM-2026-00999");
  });
});
