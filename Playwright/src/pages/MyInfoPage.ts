import { Locator, Page } from "@playwright/test";
import path from "path";
const filePath = path.resolve(__dirname, "../../TestImage.jpg");

export class MyInfoPage {
  readonly page: Page;
  private Myinfo: Locator;
  private clickImage: Locator;
  private uploadButton: Locator;
  private fileInput: Locator;
  private ImageSave: Locator;
  private updateMessage: Locator;
  constructor(page: Page) {
    this.page = page;
    this.Myinfo = page.locator("text=My Info");
    this.clickImage = page.locator(".employee-image");
    this.uploadButton = page.locator(".employee-image-action");
    this.fileInput = page.locator('input[type="file"].oxd-file-input');
    this.ImageSave = page.locator("button[type='submit']");

    this.updateMessage = page.locator(
      ".oxd-text.oxd-text--p.oxd-text--toast-message.oxd-toast-content-text"
    );
  }

  /**
   * Uploads a profile picture in the My Info section.
   *
   * Steps:
   * 1. Click on the 'My Info' tab to open the profile page.
   * 2. Click on the profile image area to initiate image upload.
   * 3. Click the upload button to activate the file input field.
   * 4. Set the file to be uploaded using the file path.
   * 5. Click the save button to upload and apply the profile picture.
   * 6. Capture and return the success message for verification.
   *
   * @returns {Promise<string>} - The success message after uploading the profile picture
   */

  async uploadProfilePicture(): Promise<string> {
    await this.Myinfo.click();
    await this.clickImage.click();
    await this.uploadButton.click();
    await this.fileInput.setInputFiles(filePath);
    await this.ImageSave.click();
    await this.page.waitForTimeout(1000);
    const successMessage = await this.updateMessage.textContent();
    return successMessage?.trim() || "";
  }
}
