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

    async selectTab(tabId: string) {
        await this.webUI.clickOrTabElement("//*[@id='" + tabId + "']");
    }

    async moveItemInTheSortable(tabId: string, sourceItem: string, targetItem: string) {
        const sourceLocator = "//*[@id='" + tabId + "']//*[contains(@class, 'list-group-item-action') and text()='" + sourceItem + "']";
        const targetLocator = "//*[@id='" + tabId + "']//*[contains(@class, 'list-group-item-action') and text()='" + targetItem + "']";
        await this.webUI.clickAndDragElement(sourceLocator, targetLocator);
    }

    async getItemIndexInSortable(tabId: string, itemName: string): Promise<number> {
        const locator = "//*[@id='" + tabId + "']//*[contains(@class, 'list-group-item-action')]";
        return await this.webUI.evaluateIndex(locator, itemName);
    }
}
