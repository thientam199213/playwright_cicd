import { Page } from "@playwright/test";
import { WebUI } from "../utils/webUI";

export class InteractionsPage {
    readonly page: Page;
    readonly webUI: WebUI;

    constructor(page: Page) {
        this.page = page;
        this.webUI = new WebUI(page);
    }

    async goto() {
        await this.page.goto("https://demoqa.com/interaction", {
            waitUntil: "domcontentloaded",
            timeout: 60000
        });
    }

    async selectMenu(menuName: string) {
        await this.webUI.clickOrTabElement("//*[@class='menu-list']//li//*[@class='text' and text()='" + menuName + "']");
    }
}
