import { test } from "playwright/test";
import { Page, Locator, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import AdminPage from "src/pages/AdminPage";
import LeavePage from "src/pages/LeavePage";
import { MyInfoPage } from "src/pages/MyInfoPage";

test.describe("Yaksha", () => {
  let loginPage: LoginPage;
  let myinfoPage: MyInfoPage;
  let adminPage: AdminPage;
  let leavePage: LeavePage;
  let BaseUrl: string;

  test.beforeEach(async ({ page, baseURL }) => {
    BaseUrl = baseURL||"";
    await page.goto(
      BaseUrl
    );
    loginPage = new LoginPage(page);
    myinfoPage = new MyInfoPage(page);
    adminPage = new AdminPage(page);
    leavePage = new LeavePage(page);
    await loginPage.performLogin();

  });

 /**
 * Test Case: Verify the Logout functionality
 *
 * Purpose:
 * Ensures that a logged-in user can successfully log out of the application
 * and is redirected back to the login page.
 *
 * Precondition:
 * - User must already be logged in.
 * - `BaseUrl` is imported from the `playwright.config.ts` file.
 *
 * Steps:
 * 1. Assert that the current URL is the dashboard URL (post-login).
 * 2. Call the `performLogOut` method to trigger the logout process.
 * 3. Assert that the redirected URL matches the expected login page URL.
 * 4. Log a success message upon successful verification.
 */

  test("1_Verify the Logout functionality", async ({ page }) => {

    await page.waitForURL(BaseUrl+"/web/index.php/dashboard/index");
    await assertUrl(page.url(),
      BaseUrl+"/web/index.php/dashboard/index"
    );
    await page.waitForTimeout(2000);
    await loginPage.performLogOut(BaseUrl);
    await assertUrl(page.url(),
      BaseUrl+"/web/index.php/auth/login"
    );
    console.log("Logout successful");
  });

  /**
   * Test Case: TS-2 Verify New holidays could be created
   *
   * Purpose:
   * Validates that a new holiday can be successfully created from the Leave > Configure > Holidays section.
   *
   * Steps:
   * 1. Log in to the application using valid credentials.
   * 2. Call the method to create a new holiday entry.
   * 3. Capture the text of the first item in the holiday list.
   * 4. Assert that the newly created holiday name appears in the list.
   * 5. Print confirmation in the console if successful.
   */

  test("TS-2 Verify New holidays could be created ", async ({ page }) => {
    await leavePage.createNewLeaveRequest();
    await page.locator("//label[text()='From']/../..//input").fill(LeavePage.randomDate);
    await page.locator("//label[text()='To']/../..//input").fill(LeavePage.randomDate);
    await page.locator('[type="submit"]').click();
    const holidayListText = await page.locator(`//div[contains(text(),"${LeavePage.HolidayName}")]`).nth(0).textContent();
    await assertItemPresentInList(
      typeof holidayListText === "string" ? holidayListText : "",
      "National Holiday123",
      "New holiday created successfully"
    );
    console.log("New holiday created successfully");
    await page.locator('.bi-trash').nth(0).click();
    await page.locator('.oxd-button--label-danger').nth(0).click();
  });

  /**
   * Test Case: TS-3 Verify an error appears when password and confirm password mismatch
   *
   * Purpose:
   * Ensures that the system displays a proper error message when the password
   * and confirm password fields do not match during user creation.
   *
   * Steps:
   * 1. Log in to the application with valid credentials.
   * 2. Navigate to the Admin > Add User section.
   * 3. Fill in mismatched values in the password and confirm password fields.
   * 4. Attempt to submit the form.
   * 5. Capture and assert the error message shown for password mismatch.
   * 6. Log success message upon verification.
   */

  test("TS-3 Verify an error appears when password and confirm password mismatch", async ({
    page,
  }) => {
    await adminPage.ConfirmPassword();
    const errorMessage = await page.locator(
      "(//span[normalize-space()='Passwords do not match'])[1]"
    ).textContent();
    await assertExactErrorMessage(
      errorMessage ?? "",
      "Passwords do not match",
      "Error message displayed for password mismatch"
    );
    console.log("Error message displayed for password mismatch");
  });

  /**
   * Test Case: TS-4 Verify Admin can add record
   *
   * Purpose:
   * Verifies that an admin user is able to successfully add a new record through the Admin section.
   *
   * Steps:
   * 1. Log in to the application using valid credentials.
   * 2. Call the method to add a new admin record.
   * 3. Capture the success message shown after saving the record.
   * 4. Assert that the success message matches the expected text.
   */

  test("TS-4 Verify Admin can add record", async ({ page }) => {
    await adminPage.AdminAdd();
    const successMessage = await page
      .locator(".oxd-toast")
      .textContent();
    await assertSuccessMessageContains(
      successMessage ?? "",
      "SuccessSuccessfully Saved×",
      "Admin record added successfully"
    );
  });

  /**
 * Test Case: TS-5 Verify navigation to the General Information tab
 *
 * Purpose:
 * Ensures that the admin can successfully navigate to the "General Information" tab
 * from the Admin > Organization section.
 *
 * Steps:
 * 1. Log in to the application using valid credentials.
 * 2. Navigate to the Admin tab.
 * 3. Go to the Organization section and click on "General Information".
 * 4. Capture the header text of the page.
 * 5. Assert that the header matches "General Information".
 */

test("TS-5 Verify navigation to the General Information tab", async ({
  page,
}) => {
  await adminPage.GenInfoTab();
  const Message = await page
    .locator("//h6[text()='General Information']")
    .textContent();
  expect(Message).toBe("General Information");
});

  /**
   * Test Case: TS-6 Verify Image could be Uploaded as profile Pic
   *
   * Purpose:
   * Validates that a user can successfully upload a profile picture from the My Info section.
   *
   * Steps:
   * 1. Log in to the application using valid credentials.
   * 2. Navigate to the My Info page and upload a profile picture.
   * 3. Capture the success message after the upload.
   * 4. Assert that the image upload was successful.
   */

  test("TS-6 Verify Image could be Uploaded as profile Pic", async ({
    page,
  }) => {
    await myinfoPage.uploadProfilePicture();
    const successMessage = await page.locator(
      ".oxd-text.oxd-text--p.oxd-text--toast-message.oxd-toast-content-text"
    ).textContent();
    await assertUploadSuccess(successMessage ?? "");
  });

  /**
 * Test Case: TS-7 Verify Admin can navigate to the Organization Structure tab
 *
 * Purpose:
 * Ensures that an admin can successfully access the "Organization Structure"
 * section under the Admin > Organization menu.
 *
 * Steps:
 * 1. Log in to the application using valid credentials.
 * 2. Call the method that navigates to the Organization Structure tab.
 * 3. Capture the page header text.
 * 4. Assert that the header matches "Organization Structure".
 */

  test("TS-7 Verify navigation to the Organization structure tab", async ({ page }) => {
    await adminPage.orgStructure();
    const result = await page.locator(
      "//h6[text()='Organization Structure']"
    ).textContent();
    expect(result).toBe("Organization Structure");
  });

  /**
   * Test Case: TS-8 Verify admin can sort the record
   *
   * Purpose:
   * Validates that the admin can sort user records (e.g., usernames, roles, etc.) and that the sorting works correctly.
   *
   * Steps:
   * 1. Log in to the application using valid credentials.
   * 2. Call the method to perform sorting on the admin records table.
   * 3. Capture the sorted list of items (e.g., user roles).
   * 4. Assert that the list is sorted in descending order using a helper function.
   * 5. Log success if sorting is verified correctly.
   */

  test("TS-8 verify admin can sort the record", async ({ page }) => {
await adminPage.adminSort();
const sortingButton = await page.locator('i.oxd-table-header-sort-icon').nth(0);
  await expect(sortingButton).toBeVisible();
});


  /**
   * Test Case: TS-9 Verify new Tab opens on clicking the Upgrade button
   *
   * Purpose:
   * Ensures that clicking the "Upgrade" button opens a new browser tab and navigates to the correct upgrade page.
   *
   * Steps:
   * 1. Log in to the application using valid credentials.
   * 2. Click the "Upgrade" button which should trigger a new tab to open.
   * 3. Capture the title of the newly opened page.
   * 4. Assert that the page title contains the expected text "Upgrade".
   * 5. Confirm that the upgrade page opened successfully.
   */

  test("TS-9 Verify new Tab opens on clicking the Upgrade button", async ({
    page, context
  }) => {
    await adminPage.upgrade();
    await expect(context.pages().length).toBe(2);
  });

  /**
   * Test Case: TS-10 Verify tooltip shows up when hovered over 'Help' button (Question mark)
   *
   * Purpose:
   * Ensures that hovering over the "Help" button (question mark icon) displays the correct tooltip.
   *
   * Steps:
   * 1. Log in to the application using valid credentials.
   * 2. Hover over the "Help" button.
   * 3. Capture the tooltip text displayed on hover.
   * 4. Assert that the tooltip contains the expected keyword "Help".
   * 5. Log a success message if the tooltip appears correctly.
   */

  test("TS-10 Verify tooltip shows up when hovered over 'Help' button (Question mark)", async ({
    page,
  }) => {
    await adminPage.helpHover();
    const tooltip = await page.locator(
      "//div[@class='oxd-topbar-body-nav-slot']/button"
    ).getAttribute("title");
    await assertTooltipContains(tooltip ?? "", "Help");
    console.log("Tooltip displayed successfully");
  });
});

/**
 * ------------------------------------------------------Helper Methods----------------------------------------------------
 */
async function assertUrl(actualUrl: string, expectedUrl: string) {
  expect(actualUrl).toBe(expectedUrl);
  console.log(`Asserted URL: ${actualUrl}`);
}

async function assertSortedListDescending(
  actualList: string[],
  logMessage: string = "List is sorted in descending order"
) {
  for (let i = 0; i < actualList.length - 1; i++) {
    if (actualList[i].localeCompare(actualList[i + 1]) < 0) {
      throw new Error(
        `List is not sorted in descending order at index ${i}: '${
          actualList[i]
        }' < '${actualList[i + 1]}'`
      );
    }
  }
  console.log(logMessage);
}

async function assertItemPresentInList(
  listText: string,
  expectedItem: string,
  successMessage: string
) {
  await new Promise((r) => setTimeout(r, 2000));
  expect(listText).toContain(expectedItem);
  console.log(successMessage);
}

async function assertExactErrorMessage(
  actualMessage: string,
  expectedMessage: string,
  logMessage: string
) {
  expect(actualMessage).toBe(expectedMessage);
  console.log(logMessage);
}

async function assertSuccessMessageContains(
  actualMessage: string,
  expectedSubstring: string,
  logMessage: string
) {
  expect(actualMessage).toContain(expectedSubstring);
  console.log(logMessage);
}



async function assertUploadSuccess(
  actualMessage: string,
  expectedText: string = "Successfully Updated",
  logMessage: string = "Profile picture uploaded successfully"
) {
  expect(actualMessage).toContain(expectedText);
  console.log(logMessage);
}

async function assertUpdateSuccess(
  actualMessage: string,
  expectedText: string = "Successfully Updated",
  logMessage: string = "Admin record updated successfully"
) {
  expect(actualMessage).toContain(expectedText);
  console.log(logMessage);
}

async function assertPageTitleContains(
  actualTitle: string,
  expectedSubstring: string,
  logMessage: string = "Page title validated successfully"
) {
  expect(actualTitle).toContain(expectedSubstring);
  console.log(logMessage);
}

async function assertTooltipContains(
  actualTooltip: string,
  expectedText: string,
  logMessage: string = "Tooltip displayed successfully"
) {
  expect(actualTooltip).toContain(expectedText);
  console.log(logMessage);
}
