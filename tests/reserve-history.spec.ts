import { test, expect, Page } from "@playwright/test";

/**
 * Test suite for Reserve History page
 *
 * Requirements:
 * - Petowner, Caretaker, Doctor can see their services
 * - Petowner can't change services status
 * - Doctor and Caretaker can change services status
 */

// Helper function to set up authentication state
async function setupAuth(
  page: Page,
  role: string,
  token: string = "mock-token",
  userId: string = "mock-user-id"
) {
  await page.goto("/");
  await page.evaluate(
    ({ role, token, userId }) => {
      localStorage.setItem("role", role);
      localStorage.setItem("token", token);
      localStorage.setItem("user_id", userId);
    },
    { role, token, userId }
  );
}

// Helper function to mock API responses
async function mockReservationsAPI(page: Page) {
  // Mock GET /services/?page=X&limit=Y endpoint (getAllReservation)
  // This matches both the API_BASE format and the environment.masterUrl format
  await page.route("**/services/?page=*", async (route) => {
    const url = route.request().url();

    if (route.request().method() === "GET" && url.includes("?page=")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            services: [
              {
                service_id: "test-service-1",
                owner_id: "owner-1",
                pet_id: "pet-1",
                payment_id: "payment-1",
                price: 1000,
                status: "wait",
                reserve_date_start: "2024-01-15T10:00:00Z",
                reserve_date_end: "2024-01-15T12:00:00Z",
                service_type: "cservice",
                staff_id: "staff-1",
              },
              {
                service_id: "test-service-2",
                owner_id: "owner-1",
                pet_id: "pet-2",
                payment_id: "payment-2",
                price: 1500,
                status: "ongoing",
                reserve_date_start: "2024-01-16T14:00:00Z",
                reserve_date_end: "2024-01-16T16:00:00Z",
                service_type: "cservice",
                staff_id: "staff-1",
              },
            ],
            amount: 2,
          },
        }),
      });
    } else {
      await route.continue();
    }
  });

  // Mock PATCH endpoint for status updates
  // Format: /services/{serviceId}/{status}/
  await page.route("**/services/*/ongoing/", async (route) => {
    if (route.request().method() === "PATCH") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    } else {
      await route.continue();
    }
  });

  await page.route("**/services/*/wait/", async (route) => {
    if (route.request().method() === "PATCH") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    } else {
      await route.continue();
    }
  });

  await page.route("**/services/*/finish/", async (route) => {
    if (route.request().method() === "PATCH") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    } else {
      await route.continue();
    }
  });
}

// Mock payments API
async function mockPaymentsAPI(page: Page) {
  // Mock GET /payments/?page=X&limit=Y endpoint (getAllPayment)
  await page.route("**/payments/?page=*", async (route) => {
    const url = route.request().url();

    if (route.request().method() === "GET" && url.includes("?page=")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            payments: [
              {
                payment_id: "payment-1",
                price: 1000,
              },
              {
                payment_id: "payment-2",
                price: 1500,
              },
            ],
            amount: 2,
          },
        }),
      });
    } else {
      await route.continue();
    }
  });
}

test.describe("Reserve History Page", () => {
  test.beforeEach(async ({ page }) => {
    await mockReservationsAPI(page);
    await mockPaymentsAPI(page);
  });

  test("Petowner can see their services but cannot change status", async ({
    page,
  }) => {
    await setupAuth(page, "pet owner");
    await page.goto("/reserve-history");

    // Wait for the page to load
    await page.waitForSelector("text=การจอง", { timeout: 10000 });

    // Verify that services are displayed
    const serviceItems = page.locator(".reserve-item");
    await expect(serviceItems).toHaveCount(2);

    // Verify that status is displayed but not clickable (no dropdown button)
    const statusButtons = page
      .locator("button")
      .filter({ hasText: /wait|ongoing|finish/ });
    await expect(statusButtons).toHaveCount(0);

    // Verify status is displayed as a div (not a button) for pet owners
    // The status div has class "text-[16px] font-bold px-8 py-1.5 rounded-[15px]"
    const statusDivs = page
      .locator(".reserve-item")
      .first()
      .locator("div.text-\\[16px\\]")
      .filter({ hasText: /^wait$|^ongoing$|^finish$/ });
    await expect(statusDivs.first()).toBeVisible();
  });

  test("Caretaker can see services and can change status", async ({ page }) => {
    await setupAuth(page, "caretaker");
    await page.goto("/reserve-history");

    // Wait for the page to load
    await page.waitForSelector("text=การจอง", { timeout: 10000 });

    // Verify that services are displayed
    const serviceItems = page.locator(".reserve-item");
    await expect(serviceItems).toHaveCount(2);

    // Verify that status buttons are clickable (dropdown buttons exist)
    const statusButtons = page
      .locator("button")
      .filter({ hasText: /wait|ongoing|finish/ });
    await expect(statusButtons.first()).toBeVisible();

    // Click on the first status button to open dropdown
    const firstStatusButton = statusButtons.first();
    await firstStatusButton.click();

    // Verify dropdown menu appears with status options
    const dropdown = page
      .locator("text=ongoing")
      .or(page.locator("text=wait"))
      .or(page.locator("text=finish"));
    await expect(dropdown.first()).toBeVisible({ timeout: 2000 });

    // Select a new status
    const ongoingOption = page.locator("text=ongoing").first();
    if (await ongoingOption.isVisible()) {
      await ongoingOption.click();

      // Wait for the status update to complete
      await page.waitForTimeout(1000);

      // Verify the status was updated (button text should change or dropdown should close)
      await expect(firstStatusButton).toBeVisible();
    }
  });

  test("Doctor can see services and can change status", async ({ page }) => {
    await setupAuth(page, "doctor");
    await page.goto("/reserve-history");

    // Wait for the page to load
    await page.waitForSelector("text=การจอง", { timeout: 10000 });

    // Verify that services are displayed
    const serviceItems = page.locator(".reserve-item");
    await expect(serviceItems).toHaveCount(2);

    // Verify that status buttons are clickable (dropdown buttons exist)
    const statusButtons = page
      .locator("button")
      .filter({ hasText: /wait|ongoing|finish/ });
    await expect(statusButtons.first()).toBeVisible();

    // Click on the first status button to open dropdown
    const firstStatusButton = statusButtons.first();
    await firstStatusButton.click();

    // Verify dropdown menu appears with status options
    const dropdown = page
      .locator("text=ongoing")
      .or(page.locator("text=wait"))
      .or(page.locator("text=finish"));
    await expect(dropdown.first()).toBeVisible({ timeout: 2000 });

    // Select a new status
    const finishOption = page.locator("text=finish").first();
    if (await finishOption.isVisible()) {
      await finishOption.click();

      // Wait for the status update to complete
      await page.waitForTimeout(1000);

      // Verify the status was updated
      await expect(firstStatusButton).toBeVisible();
    }
  });

  test("Status dropdown shows all three options: ongoing, wait, finish", async ({
    page,
  }) => {
    await setupAuth(page, "caretaker");
    await page.goto("/reserve-history");

    // Wait for the page to load
    await page.waitForSelector("text=การจอง", { timeout: 10000 });

    // Find and click a status button
    const statusButtons = page
      .locator("button")
      .filter({ hasText: /wait|ongoing|finish/ });
    await statusButtons.first().click();

    // Wait for dropdown to appear
    await page.waitForSelector(".absolute.top-full", { timeout: 2000 });

    // Verify all three status options are visible in the dropdown (inside the dropdown menu)
    const dropdown = page.locator(".absolute.top-full");
    await expect(dropdown.locator("text=ongoing")).toBeVisible();
    await expect(dropdown.locator("text=wait")).toBeVisible();
    await expect(dropdown.locator("text=finish")).toBeVisible();
  });

  test("Petowner cannot see status dropdown button", async ({ page }) => {
    await setupAuth(page, "pet owner");
    await page.goto("/reserve-history");

    // Wait for the page to load
    await page.waitForSelector("text=การจอง", { timeout: 10000 });

    // Verify no status dropdown buttons exist
    const statusButtons = page
      .locator("button")
      .filter({ hasText: /wait|ongoing|finish/ });
    await expect(statusButtons).toHaveCount(0);

    // Verify status is displayed as static text (div with specific class, not button)
    // The status div has class "text-[16px] font-bold px-8 py-1.5 rounded-[15px]"
    const statusText = page
      .locator(".reserve-item")
      .first()
      .locator("div.text-\\[16px\\]")
      .filter({ hasText: /^wait$|^ongoing$|^finish$/ });
    await expect(statusText.first()).toBeVisible();
  });
});
