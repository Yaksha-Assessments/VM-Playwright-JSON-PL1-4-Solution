import { Locator, Page } from "@playwright/test";
const data = JSON.parse(JSON.stringify(require("../Data/login.json")));

export class LoginPage {
  readonly page: Page;
  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private loginErrorMessage: Locator;
  private adminButton: Locator;
  private logOut: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator(
      "//input[@placeholder='username' or @placeholder='Username']"
    );
    this.passwordInput = page.locator(
      "//input[@placeholder='password' or @placeholder='Password']"
    );
    this.loginButton = page.locator("//button[@type='submit']");
    this.loginErrorMessage = page.locator(``);
    this.adminButton = page.locator('//li[@class="oxd-userdropdown"]');
    this.logOut = page.locator("//ul[@class='oxd-dropdown-menu']/li[4]");
  }
  async performLogin() {
    await this.usernameInput.fill(data.ValidLogin.ValidUserName);
    await this.passwordInput.fill(data.ValidLogin.ValidPassword);
    await this.loginButton.click();
  }

  /**
   * Logs the user out of the application.
   *
   * Steps:
   * 1. Clicks on the admin/profile button to open the dropdown.
   * 2. Clicks on the logout option to initiate logout.
   * 3. Waits for the URL to confirm redirection to the login page.
   * 4. Returns the current URL after logout for validation purposes.
   *
   * @returns {Promise<string>} - The URL after successful logout
   */

  async performLogOut(): Promise<string> {
    await this.adminButton.click();
    await this.logOut.click();
    const Url = await this.page.waitForURL(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );
    return this.page.url();
  }
}
module.exports = { LoginPage };
