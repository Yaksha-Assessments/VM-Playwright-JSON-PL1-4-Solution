import { Page, Locator, expect } from "@playwright/test";
import { LoadFnOutput } from "module";
import { text } from "stream/consumers";
export default class AdminPage {
  readonly page: Page;
  private AdminLink: Locator;
  private editbutton: Locator;
  private empName: Locator;
  private empNameSubmit: Locator;
  private sortUsername: Locator;
  private sortDesc: Locator;
  private upgradeButton: Locator;
  private maintitle: Locator;
  private admindropdown: Locator;
  private adminSearch: Locator;
  private searchButton: Locator;
  private userRoleElements: Locator;
  private username: Locator;
  private AddButton: Locator;
  private confirmPassword: Locator;
  private errormessage: Locator;
  private userName: Locator;
  private sucessMessage: Locator;
  private usernameButton: Locator;
  private deleteButton: Locator;
  private deleteButtonConfirm: Locator;
  private deleteConfirm: Locator;
  private userRole: Locator;
  private helpbutton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.AdminLink = page.locator("text=Admin");
    this.editbutton = page.locator(
      "//div[@class='oxd-table-cell-actions']/button[2]"
    );
    this.deleteButton = page.locator(
      "//div[@class='oxd-table-cell-actions']/button[1]"
    );
    this.deleteButtonConfirm = page.locator(
      "//div[@class='orangehrm-modal-footer']/button[2]"
    );
    this.empName = page.locator('//input[@placeholder="Type for hints..."]');
    this.empNameSubmit = page.locator("button[type='submit']");
    this.sortUsername = page.locator(
      "(//i[contains(@class, 'bi-sort-alpha-down')])[1]"
    );
    this.upgradeButton = this.page.locator("a.orangehrm-upgrade-link");
    this.maintitle = page.locator(".main-title");
    this.admindropdown = page.locator(
      "(//div[@class='oxd-select-text oxd-select-text--active'])[1]"
    );
    this.adminSearch = page.locator('div[role="option"]:has-text("Admin")');
    this.searchButton = page.locator(
      'button[type="submit"]:has-text("Search")'
    );
    this.AddButton = page.locator(
      "//div[@class='orangehrm-header-container']/button"
    );
    this.userRoleElements = page
      .locator(".oxd-table-body .oxd-table-row >> nth=0")
      .locator('xpath=../../..//div[@role="row"]//div[@role="cell"][2]');
    this.confirmPassword = page.locator("//input[@type='password']");
    this.username = page.locator("//input[@autocomplete='off']");
    this.errormessage = page.locator(
      "(//span[normalize-space()='Passwords do not match'])[1]"
    );
    this.userName = page.locator("//input[@autocomplete='off']");
    this.sucessMessage = page.locator(
      "(//p[@class='oxd-text oxd-text--p oxd-text--toast-message oxd-toast-content-text'])[1]"
    );
    this.usernameButton = page.locator(
      "//div[@class='oxd-form-actions']/button[2]"
    );
    this.deleteConfirm = page.locator(
      ".oxd-text.oxd-text--p.oxd-text--toast-message.oxd-toast-content-text"
    );
    this.userRole = page.locator(
      "//div[@class='oxd-select-text oxd-select-text--active']"
    );
    this.sortDesc = page.locator(
      "//div[@class='--active oxd-table-header-sort-dropdown']//span[@class='oxd-text oxd-text--span'][normalize-space()='Descending']"
    );
    this.sortUsername = page.locator(
      "(//i[contains(@class, 'bi-sort-alpha-down')])[1]"
    );
    this.helpbutton = page.locator(
      "//div[@class='oxd-topbar-body-nav-slot']/button"
    );
  }

  /**
   * Attempts to create a new user with mismatched password and confirm password.
   *
   * Steps:
   * 1. Click on the Admin tab and then the Add button to open the user creation form.
   * 2. Enter mismatched values in the password and confirm password fields.
   * 3. Submit the form to trigger validation.
   * 4. Wait for the error message to appear indicating the mismatch.
   * 5. Return the error message text for assertion in the test.
   *
   * @returns {Promise<string>} - The error message shown for password mismatch (trimmed)
   */

  public async ConfirmPassword(): Promise<string> {
    await this.AdminLink.nth(0).click();
    await this.AddButton.click();

    // Fill password and confirm password with mismatched values
    await this.confirmPassword.nth(0).fill("Test@123"); // Password
    await this.confirmPassword.nth(1).fill("Mismatch@123"); // Confirm Password

    // Try submitting to trigger validation
    await this.empNameSubmit.click();

    // Wait for error message to appear
    await this.errormessage.waitFor({ state: "visible", timeout: 5000 });

    const errorMessage = await this.errormessage.textContent();
    return errorMessage?.trim() || "";
  }

  /**
   * Edits an existing user record in the Admin section.
   *
   * Steps:
   * 1. Navigate to the Admin tab.
   * 2. Click the edit button for the second user in the list.
   * 3. Clear the existing username and update it with a new value ("TestUser").
   * 4. Click the save/update button to submit the changes.
   * 5. Wait for the success message to confirm that the update was applied.
   * 6. Return the success message for verification in the test.
   *
   * @returns {Promise<string>} - The trimmed success message confirming the update
   */

  public async AdminEdit(): Promise<string> {
    await this.AdminLink.nth(0).click();
    await this.editbutton.nth(1).scrollIntoViewIfNeeded();
    await this.editbutton.nth(1).click();
    await this.userName.clear().then(() => this.userName.fill("TestUser"));
    await this.page.waitForTimeout(1500);
    await this.usernameButton.click();
    await this.page.waitForTimeout(3000);
    const successMessage = await this.sucessMessage.textContent();
    return successMessage?.trim() || "";
  }

  /**
   * Automates the process of adding a new user record through the Admin panel.
   *
   * Steps:
   * 1. Navigate to the Admin module and click the Add button.
   * 2. Select user roles from dropdowns using Playwright locators.
   * 3. Enter employee name and select from the autocomplete list.
   * 4. Generate a unique username and fill in password and confirm password fields.
   * 5. Submit the form and wait for the success toast message to appear.
   * 6. Return the success message text for validation in the test.
   *
   * Notes:
   * - Uses dynamic waits for dropdowns and toast visibility.
   * - Ensures username uniqueness using a helper function.
   *
   * @returns {Promise<string>} - The trimmed success message displayed after saving
   */

  public async AdminAdd() {
    await this.AdminLink.nth(0).click();
    await this.AddButton.click();
    await this.userRole.nth(0).click();
    const adminRoleOption = this.page.locator('//div[@role= "listbox"]');
    await adminRoleOption.click();
    //await this.page.locator('//div[@role="option" and text()="Admin"]').click();
    await this.userRole.nth(1).click();
    const UserRoleOption = this.page.locator('//div[@role= "listbox"][1]');
    await UserRoleOption.click();
    await this.empName
      .clear()
      .then(() => this.empName.fill("a"))
      .then(() => this.empName.click());
    await this.page.waitForTimeout(5000); // Wait for the dropdown to appear
    const empseletion = this.page.locator(".oxd-autocomplete-dropdown");
    await empseletion.click();
    await this.username.nth(0).fill(generateUniqueUsername());
    await this.confirmPassword.nth(0).fill("Test@123");
    await this.confirmPassword.nth(1).fill("Test@123");
    await this.empNameSubmit.click();
    await this.page.waitForTimeout(1500); // Wait for the success message to appear
    const addsuccessMessage = await this.page
      .locator(".oxd-toast")
      .textContent();
    return addsuccessMessage?.trim() || "";
  }

  /**
   * Performs sorting on the Admin user list and returns the list of user roles after sorting.
   *
   * Steps:
   * 1. Navigate to the Admin section.
   * 2. Click the username column header to sort the list.
   * 3. Click again to apply descending sort (if applicable).
   * 4. Wait for the UI to finish loading and ensure network calls are idle.
   * 5. Extract all user role values from the sorted table.
   * 6. Trim any extra spaces and return the cleaned list of roles.
   *
   * @returns {Promise<string[]>} - A list of trimmed user roles from the sorted admin table
   */

  public async adminSort(): Promise<string[]> {
     await this.AdminLink.nth(0).click();
    await this.sortUsername.click();
    await this.sortDesc.click();

    await this.page.waitForTimeout(2000);
    await this.page.waitForLoadState("networkidle");

    const roles = await this.userRoleElements.allTextContents();
    const trimmedRoles = roles.map((role) => role.trim());

    return trimmedRoles;
  }

  /**
   * Deletes a user from the Admin > User Management table.
   *
   * Steps:
   * 1. Clicks on the Admin tab to navigate to the user list.
   * 2. Identifies and clicks the delete button for the second user in the list.
   * 3. Confirms the deletion in the confirmation dialog.
   * 4. Captures the success message displayed after deletion.
   *
   * @returns {Promise<string>} - The trimmed success message confirming deletion
   */

  public async deleteUser(): Promise<string> {
    await this.AdminLink.nth(0).click();
    await this.deleteButton.nth(1).click();
    await this.page.waitForTimeout(2000);
    await this.deleteButtonConfirm.click();
    const successMessage = await this.deleteConfirm.textContent();
    return successMessage?.trim() || "";
  }

  /**
   * Clicks the "Upgrade" button and captures the title of the newly opened tab.
   *
   * Steps:
   * 1. Navigate to the Admin section by clicking the Admin tab.
   * 2. Wait briefly to ensure the UI is fully loaded.
   * 3. Click the "Upgrade" button and listen for a new page (tab) opening.
   * 4. Wait until the new tab finishes loading completely.
   * 5. Capture and return the title of the newly opened upgrade page.
   *
   * @returns {Promise<string>} - The title of the upgrade page opened in a new tab
   */

  public async upgrade(): Promise<string> {
    await this.AdminLink.nth(0).click();
    await this.page.waitForTimeout(2000);
    const [upgradeTab] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.upgradeButton.click(),
    ]);
    await this.page.waitForTimeout(2000);
    const title = await upgradeTab.title();
    return title;
  }

  public async adminSearchh(): Promise<string[]> {
    await this.AdminLink.nth(0).click();
    await this.admindropdown.click();
    await this.adminSearch.click();
    await this.searchButton.click();
    const roles = await this.userRoleElements.allTextContents();
    return roles.map((role) => role.trim());
  }

  /**
   * Hovers over the "Help" button (question mark icon) and retrieves the tooltip text.
   *
   * Steps:
   * 1. Navigate to the Admin section.
   * 2. Wait briefly to ensure the page is fully loaded.
   * 3. Hover over the "Help" button to trigger the tooltip.
   * 4. Wait for the tooltip to appear (usually via the 'title' attribute).
   * 5. Retrieve and return the tooltip text from the 'title' attribute.
   *
   * @returns {Promise<string>} - The tooltip text shown on hovering over the Help icon
   */

  public async helpHover(): Promise<string> {
    await this.AdminLink.nth(0).click();
    await this.page.waitForTimeout(2000);
    await this.helpbutton.hover();
    await this.page.waitForTimeout(4000);

    const tooltip = await this.helpbutton.getAttribute("title");
    return tooltip ?? "";
  }
}

function generateUniqueUsername(base: string = "TestUser"): string {
  const uniqueSuffix = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `${base}${uniqueSuffix}`;
}
