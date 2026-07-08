import { test, expect, Page } from "@playwright/test";

/**
 * Admission Workflow E2E Tests
 *
 * These tests mock the application-form and interview-status API responses
 * to simulate different workflow states and verify visibility rules.
 */

// ── Helpers ──────────────────────────────────────────────────

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

/** Mock the application-form list API to return an application with a given workflow_state. */
async function mockApplicationState(page: Page, workflowState: string, docstatus: number = 1) {
  await page.route("**/api/v1/application-form", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        forms: [
          {
            name: "ADM-2026-00120",
            docstatus,
            modified: new Date().toISOString(),
            enable_scholarship_form: 0,
            workflow_state: workflowState,
          },
        ],
      }),
    });
  });
}

/** Mock interview status API — either with a booking or null. */
async function mockInterviewStatus(page: Page, hasBooking: boolean) {
  await page.route("**/api/v1/interview/status", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        booking: hasBooking
          ? {
              referenceNumber: "INT-2026-001",
              candidateName: "Test Candidate",
              applicationNumber: "ADM-2026-00120",
              programApplied: "Vedica Scholars Programme",
              email: "candidate@example.com",
              phone: "+91 9999999999",
              date: "2026-07-15",
              time: "10:00 AM",
              timezone: "IST (UTC+5:30)",
              mode: "Online",
            }
          : null,
      }),
    });
  });
}

// ── Test Suite ────────────────────────────────────────────────

test.describe("Admission Workflow Visibility", () => {
  test.beforeEach(async ({ context }) => {
    await injectAuthCookies(context);
  });

  test("1. New student (Draft) → only sees Application Form, no Interview/Payment in sidebar", async ({
    page,
  }) => {
    await mockApplicationState(page, "Draft", 0);
    await mockInterviewStatus(page, false);

    await page.goto("/dashboard");
    await page.waitForTimeout(2000);

    // Sidebar should show Application Form(s) link
    await expect(page.locator("text=All Application Form(s)")).toBeVisible();

    // Interview and Payments should NOT be in sidebar
    const sidebarInterview = page.locator("aside >> text=My Interview");
    const sidebarPayments = page.locator("aside >> text=My Payments");
    await expect(sidebarInterview).not.toBeVisible();
    await expect(sidebarPayments).not.toBeVisible();
  });

  test("2. Submitted with Offer Letter Sent → Offer Letter visible, Interview hidden", async ({
    page,
  }) => {
    await mockApplicationState(page, "Offer Letter Sent", 1);
    await mockInterviewStatus(page, false);

    await page.goto("/dashboard");
    await page.waitForTimeout(2000);

    // Offer Letter step should be visible in card
    await expect(page.locator("text=Offer Letter Issued")).toBeVisible();

    // Interview should NOT be in sidebar (offer not accepted yet)
    const sidebarInterview = page.locator("aside >> text=My Interview");
    await expect(sidebarInterview).not.toBeVisible();
  });

  test("3. Offer Letter Accepted → Interview Scheduler becomes visible", async ({
    page,
  }) => {
    await mockApplicationState(page, "Offer Letter Accepted", 1);
    await mockInterviewStatus(page, false);

    await page.goto("/dashboard");
    await page.waitForTimeout(2000);

    // Offer Letter Accepted step should be in journey
    await expect(page.locator("text=Offer Letter Accepted")).toBeVisible();

    // Interview link should be in sidebar
    const sidebarInterview = page.locator("aside >> text=My Interview");
    await expect(sidebarInterview).toBeVisible();

    // Interview Schedule step should be in card
    await expect(page.locator("text=Interview Schedule")).toBeVisible();
  });

  test("4. Offer Letter Sent (not accepted) → Interview remains hidden", async ({
    page,
  }) => {
    await mockApplicationState(page, "Offer Letter Sent", 1);
    await mockInterviewStatus(page, false);

    await page.goto("/dashboard");
    await page.waitForTimeout(2000);

    // Interview should NOT be in sidebar
    const sidebarInterview = page.locator("aside >> text=My Interview");
    await expect(sidebarInterview).not.toBeVisible();
  });

  test("5. Interview booked → Payment option becomes visible", async ({
    page,
  }) => {
    await mockApplicationState(page, "Offer Letter Accepted", 1);
    await mockInterviewStatus(page, true);

    await page.goto("/dashboard");
    await page.waitForTimeout(2000);

    // Payment link should be in sidebar
    const sidebarPayments = page.locator("aside >> text=My Payments");
    await expect(sidebarPayments).toBeVisible();

    // Payment step should be in card
    await expect(page.locator("text=Admission Payment Pending")).toBeVisible();
  });

  test("6. No interview booking → Payment hidden", async ({ page }) => {
    await mockApplicationState(page, "Offer Letter Accepted", 1);
    await mockInterviewStatus(page, false);

    await page.goto("/dashboard");
    await page.waitForTimeout(2000);

    // Payment should NOT be in sidebar
    const sidebarPayments = page.locator("aside >> text=My Payments");
    await expect(sidebarPayments).not.toBeVisible();
  });

  test("7. Direct URL /dashboard/interview when ineligible → redirect to /dashboard", async ({
    page,
  }) => {
    // Offer Letter Sent but NOT accepted → not eligible
    await mockApplicationState(page, "Offer Letter Sent", 1);
    await mockInterviewStatus(page, false);

    await page.goto("/dashboard/interview");
    // Should be redirected to /dashboard
    await page.waitForURL("**/dashboard", { timeout: 10000 });
    expect(page.url()).toContain("/dashboard");
    expect(page.url()).not.toContain("/interview");
  });

  test("8. Direct URL /dashboard/payments when no interview → shows interview required message", async ({
    page,
  }) => {
    await mockApplicationState(page, "Offer Letter Accepted", 1);
    await mockInterviewStatus(page, false);

    await page.goto("/dashboard/payments");
    await page.waitForTimeout(3000);

    // Should show the "Interview Required" message
    await expect(page.locator("text=Interview Required")).toBeVisible();
    await expect(
      page.locator("text=Complete your interview to unlock the payment section")
    ).toBeVisible();
  });
});
