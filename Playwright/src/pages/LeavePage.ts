import { Page, Locator, expect } from "@playwright/test";

export default class LeavePage {
  readonly page: Page;
  private leave: Locator;
  private leaveDropdown: Locator;
  private holiday: Locator;
  private configure: Locator;
  private button: Locator;
  private holidayName: Locator;
  private holidayDateDDMMYYYY: Locator;
  private holidayDateYYYYMMDD: Locator;
  private holidayDateYYYYDDMM: Locator;
  private saveButton: Locator;
  private holidayList: Locator;

  public static readonly HolidayName = "National Holiday123";
  private static readonly startDate = new Date("2025-01-01");
  private static readonly endDate = new Date("2025-12-31");
  public static randomDate: any;

  constructor(page: Page) {
    this.page = page;
    this.leave = page.locator("//ul[@class='oxd-main-menu']/li[3]");
    this.leaveDropdown = page.locator(
      "(//span[normalize-space()='Configure'])[1]"
    );
    this.configure = page.locator("li.--visited");
    this.holiday = page.locator("(//ul[@class='oxd-dropdown-menu']/li[4])");
    this.button = page.locator(
      "//div[@class='orangehrm-header-container']/button"
    );
    this.holidayName = page.locator(
      "(//input[@class='oxd-input oxd-input--active'])[2]"
    );

    // All possible placeholder formats
    this.holidayDateDDMMYYYY = page.locator(
      "//input[@placeholder='dd-mm-yyyy']"
    );
    this.holidayDateYYYYMMDD = page.locator(
      "//input[@placeholder='yyyy-mm-dd']"
    );
    this.holidayDateYYYYDDMM = page.locator(
      "//input[@placeholder='yyyy-dd-mm']"
    );

    this.saveButton = page.locator(
      "//div[@class='oxd-form-actions']/button[2]"
    );
    this.holidayList = page.locator(
      `//div[contains(text(),"${LeavePage.HolidayName}")]`
    );
  }

  /**
   * Creates a new holiday entry in the system.
   *
   * Steps:
   * 1. Navigates through Leave > Configure > Holidays section.
   * 2. Fills in the holiday name with a predefined static value.
   * 3. Detects the correct date input format by checking visibility of specific fields.
   * 4. Generates and fills a random date within the allowed range based on the detected format.
   * 5. Saves the form and waits for the new holiday to appear in the list.
   */

  async createNewLeaveRequest(){
    await this.leave.click();
    await this.configure.click();
    await this.leaveDropdown.click();
    await this.holiday.click();
    await this.button.click();

    await this.holidayName.fill(LeavePage.HolidayName);

    // Check which date input is present and visible
    let dateField: Locator;
    let format: "dd-mm-yyyy" | "yyyy-mm-dd" | "yyyy-dd-mm";

    if (await this.holidayDateDDMMYYYY.isVisible()) {
      dateField = this.holidayDateDDMMYYYY;
      format = "dd-mm-yyyy";
    } else if (await this.holidayDateYYYYMMDD.isVisible()) {
      dateField = this.holidayDateYYYYMMDD;
      format = "yyyy-mm-dd";
    } else if (await this.holidayDateYYYYDDMM.isVisible()) {
      dateField = this.holidayDateYYYYDDMM;
      format = "yyyy-dd-mm";
    } else {
      throw new Error("No supported date input field found.");
    }

    LeavePage.randomDate = this.getRandomDate(
      LeavePage.startDate,
      LeavePage.endDate,
      format
    );
    await dateField.fill(LeavePage.randomDate);
    await this.saveButton.click();
    let validationCount = await this.page.locator("//span[text()='Already exists']").count();
    while( validationCount > 0) {
      LeavePage.randomDate = await this.getRandomDate(
        LeavePage.startDate,
        LeavePage.endDate,
        format
      );
      await dateField.fill(LeavePage.randomDate);
      await this.saveButton.click();
      await this.saveButton.click();
      validationCount = await this.page.locator("//span[text()='Already exists']").count();
    }
  }

  private getRandomDate(start: Date, end: Date, format: string): string {
    const randomTime =
      start.getTime() + Math.random() * (end.getTime() - start.getTime());
    const date = new Date(randomTime);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    switch (format) {
      case "yyyy-mm-dd":
        return `${year}-${month}-${day}`;
      case "yyyy-dd-mm":
        return `${year}-${day}-${month}`;
      case "dd-mm-yyyy":
      default:
        return `${day}-${month}-${year}`;
    }
  }
}
