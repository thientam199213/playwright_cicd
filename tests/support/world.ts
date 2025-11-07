import { setDefaultTimeout, setWorldConstructor } from "@cucumber/cucumber";
import { chromium, Browser, Page, BrowserContext } from "@playwright/test";

setDefaultTimeout(30 * 1000); // Set timeout 1 lần cho toàn bộ project

export class CustomWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  async openBrowser() {
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  async closeBrowser() {
    await this.browser.close();
  }
}

setWorldConstructor(CustomWorld);
