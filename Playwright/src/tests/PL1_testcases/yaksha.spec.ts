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

  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
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
   * Ensures that the user can successfully log out from the application.
   *
   * Steps:
   * 1. Perform login using valid credentials.
   * 2. Trigger the logout action.
   * 3. Capture the redirected URL after logout.
   * 4. Assert that the URL matches the expected login page URL.
   * 5. Log success message upon successful verification.
   */

  test("1_Verify the Logout functionality", async ({ page }) => {
    
    const loggedOutUrl = await loginPage.performLogOut();
    await assertUrl(
      loggedOutUrl,
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
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
   // await loginPage.performLogin();
    const holidayListText = await leavePage.createNewLeaveRequest();
    await assertItemPresentInList(
      holidayListText,
      "National Holiday123",
      "New holiday created successfully"
    );
    console.log("New holiday created successfully");
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
    const errorMessage = await adminPage.ConfirmPassword();
    await assertExactErrorMessage(
      errorMessage,
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
    const successMessage = await adminPage.AdminAdd();
    await assertSuccessMessageContains(
      successMessage,
      "SuccessSuccessfully Saved×",
      "Admin record added successfully"
    );
  });

  /**
   * Test Case: TS-5 Verify User should be deleted from the table
   *
   * Purpose:
   * Ensures that an admin can successfully delete a user from the user management table.
   *
   * Steps:
   * 1. Log in to the application using valid credentials.
   * 2. Trigger the user deletion process using the `deleteUser` method.
   * 3. Capture the success message after deletion.
   * 4. Assert that the deletion was successful using a utility assertion.
   */

  test("TS-5 Verify User should be deleted from the table", async ({
    page,
  }) => {
    const successMessage = await adminPage.deleteUser();
    await assertDeletionSuccess(successMessage);
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
    const successMessage = await myinfoPage.uploadProfilePicture();
    await assertUploadSuccess(successMessage);
  });

  /**
   * Test Case: TS-7 Verify Admin can edit record
   *
   * Purpose:
   * Ensures that an admin is able to edit an existing user record successfully in the Admin section.
   *
   * Steps:
   * 1. Log in to the application using valid credentials.
   * 2. Call the method that performs the record edit.
   * 3. Capture the success message returned after editing the record.
   * 4. Assert that the update operation was successful based on the message.
   */

  test("TS-7 Verify Admin can edit record", async ({ page }) => {
    const successMessage = await adminPage.AdminEdit();
    await assertUpdateSuccess(successMessage);
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
  const trimmedRoles = await adminPage.adminSort();

  // Assertion: List is not empty
  expect(trimmedRoles).not.toHaveLength(0);

  // Assertion: List is in descending order
  const sortedCopy = [...trimmedRoles].sort((a, b) => b.localeCompare(a));
  expect(trimmedRoles).toEqual(sortedCopy);

  await assertSortedListDescending(
    trimmedRoles,
    "Admin can sort the record successfully"
  );
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
    page,
  }) => {
    const title = await adminPage.upgrade();
    await assertPageTitleContains(
      title,
      "Upgrade",
      "Upgrade tab opened successfully"
    );
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
    const tooltip = await adminPage.helpHover();
    await assertTooltipContains(tooltip, "Help");
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

async function assertDeletionSuccess(
  actualMessage: string,
  expectedText: string = "Successfully Deleted",
  logMessage: string = "User deleted successfully"
) {
  expect(actualMessage).toContain(expectedText);
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
