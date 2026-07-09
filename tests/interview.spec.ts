import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

test.describe("Interview Scheduling Module", () => {
  // Reset the local JSON database to a clean empty state before running tests
  test.beforeAll(async () => {
    try {
      const dbPath = path.resolve(__dirname, "../src/app/api/v1/interview/data.json");
      fs.writeFileSync(dbPath, JSON.stringify({ bookings: {} }, null, 2), "utf-8");
    } catch (e) {
      console.warn("Failed to reset test DB file:", e);
    }
  });

  test.beforeEach(async ({ page, context }) => {
    // Inject mock authentication cookies into the Playwright browser context 
    // to bypass the dashboard redirects in middleware.ts (proxy.ts)
    await context.addCookies([
      {
        name: "sid",
        value: "mock-test-session-sid-999",
        domain: "localhost",
        path: "/",
      },
      {
        name: "user_id",
        value: "candidate@example.com",
        domain: "localhost",
        path: "/",
      },
      {
        name: "full_name",
        value: "Candidate Name",
        domain: "localhost",
        path: "/",
      },
      {
        name: "system_user",
        value: "no",
        domain: "localhost",
        path: "/",
      },
      {
        name: "user_lang",
        value: "en",
        domain: "localhost",
        path: "/",
      }
    ]);

    // Mock application forms list to return active form and bypass login redirects
    await page.route("**/api/v1/application-form", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          forms: [
            {
              name: "ADM-2026-00121",
              docstatus: 1,
              modified: new Date().toISOString(),
              enable_scholarship_form: 0,
              workflow_state: "Offer Letter Accepted",
            },
          ],
        }),
      });
    });

    // Navigate to the interview scheduling page
    await page.goto("/dashboard/interview");
  });

  test("1. Load Scheduler and verify elements", async ({ page }) => {
    const bookedHeader = page.locator("text=Your Scheduled Interview");
    const schedulerHeader = page.locator("text=Schedule Interview Session");

    // Wait for the skeleton loading screen to disappear and stable content to load
    await expect(bookedHeader.or(schedulerHeader)).toBeVisible({ timeout: 15000 });

    // Self-healing: if an active booking already exists on the backend, cancel it first
    if (await bookedHeader.isVisible()) {
      await page.locator("button:has-text('Cancel Booking')").click();
      await page.locator("button:has-text('Yes, Cancel Interview')").click();
      
      // Wait and verify we are back on the clean scheduling form
      await expect(schedulerHeader).toBeVisible({ timeout: 10000 });
    }

    // Verify title and description
    await expect(schedulerHeader).toBeVisible();
    await expect(
      page.locator("text=Select your preferred date, interview mode, and time slot below.")
    ).toBeVisible();

    // Verify candidate information card exists
    await expect(page.locator("text=Candidate Information")).toBeVisible();
    await expect(page.locator("text=Candidate Name").first()).toBeVisible();

    // Verify calendar renders
    await expect(page.locator("button[aria-label*='Previous month']")).toBeVisible();
    await expect(page.locator("button[aria-label*='Next month']")).toBeVisible();

    // Verify mode info panel renders
    await expect(page.locator("h3:has-text('Interview Mode')")).toBeVisible();
    await expect(page.locator("text=Online Interview")).toBeVisible();

    // Verify time slots default prompt
    await expect(page.locator("text=Choose a Date First")).toBeVisible();
  });

  test("2. Select Date and show time slots", async ({ page }) => {
    const bookedHeader = page.locator("text=Your Scheduled Interview");
    const schedulerHeader = page.locator("text=Schedule Interview Session");
    await expect(bookedHeader.or(schedulerHeader)).toBeVisible({ timeout: 15000 });

    // Find an available calendar day
    const calendarDays = page.locator("button[data-availability='available']");
    const count = await calendarDays.count();
    
    if (count > 0) {
      // Click the first available date
      await calendarDays.first().click();

      // Check if slots list title appears
      await expect(page.locator("text=Select Available Time Slot")).toBeVisible();

      // Check for available slot cards
      const slots = page.locator("button:has-text('seats left')");
      await expect(slots.first()).toBeVisible();
    }
  });

  test("3. Complete full booking flow (Book, Success, Download)", async ({ page }) => {
    const bookedHeader = page.locator("text=Your Scheduled Interview");
    const schedulerHeader = page.locator("text=Schedule Interview Session");
    await expect(bookedHeader.or(schedulerHeader)).toBeVisible({ timeout: 15000 });

    // 1. Select date
    const calendarDays = page.locator("button[data-availability='available']");
    if ((await calendarDays.count()) > 0) {
      await calendarDays.first().click();

      // 2. Select slot
      const slots = page.locator("button:has-text('seats left'):not([disabled])");
      if ((await slots.count()) > 0) {
        const slotTime = await slots.first().locator("span.font-bold").innerText();
        await slots.first().click();

        // 3. Click Schedule button
        await page.locator("button:has-text('Schedule Interview')").click();

        // 4. Verify Confirmation Dialog
        await expect(page.locator("text=Confirm Booking Details")).toBeVisible();
        await expect(page.locator(`text=${slotTime}`)).toBeVisible();

        // 5. Confirm Booking
        await page.locator("button:has-text('Confirm Booking')").click();

        // 6. Verify Success View
        await expect(page.locator("text=Interview Scheduled!")).toBeVisible();
        await expect(page.locator("text=Reference No")).toBeVisible();

        // 7. Verify Action Buttons
        await expect(page.locator("button:has-text('Download Confirmation')")).toBeVisible();
        await expect(page.locator("a:has-text('Return to Dashboard')")).toBeVisible();
      }
    }
  });

  test("4. Cancellation flow validation", async ({ page }) => {
    const bookedHeader = page.locator("text=Your Scheduled Interview");
    const schedulerHeader = page.locator("text=Schedule Interview Session");
    await expect(bookedHeader.or(schedulerHeader)).toBeVisible({ timeout: 15000 });

    const cancelBookingBtn = page.locator("button:has-text('Cancel Booking')");
    
    if (await cancelBookingBtn.isVisible()) {
      await cancelBookingBtn.click();

      // Verify warning block appears
      await expect(page.locator("text=Are you sure you want to cancel?")).toBeVisible();
      await expect(page.locator("button:has-text('Yes, Cancel Interview')")).toBeVisible();

      // Trigger cancellation
      await page.locator("button:has-text('Yes, Cancel Interview')").click();

      // Verify redirect to booking schedule selection page
      await expect(page.locator("text=Schedule Interview Session")).toBeVisible();
    }
  });

  test("5. Responsive Viewport Check", async ({ page }) => {
    const bookedHeader = page.locator("text=Your Scheduled Interview");
    const schedulerHeader = page.locator("text=Schedule Interview Session");
    await expect(bookedHeader.or(schedulerHeader)).toBeVisible({ timeout: 15000 });

    const elementToCheck = schedulerHeader.or(bookedHeader);

    // Desktop View
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(elementToCheck.first()).toBeVisible();

    // Tablet View
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(elementToCheck.first()).toBeVisible();

    // Mobile View
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(elementToCheck.first()).toBeVisible();
  });
});
