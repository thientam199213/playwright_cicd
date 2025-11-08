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

    async moveItemInTheSortable(sourceItem: string, targetItem: string) {
        const sourceLocator = "//*[@id='demo-tabpane-list']//*[contains(@class, 'list-group-item-action') and text()='" + sourceItem + "']";
        const targetLocator = "//*[@id='demo-tabpane-list']//*[contains(@class, 'list-group-item-action') and text()='" + targetItem + "']";
        await this.webUI.clickAndDragElement(sourceLocator, targetLocator);
    }

    async getItemIndexInSortable(itemName: string): Promise<number> {
        const locator = "//*[@id='demo-tabpane-list']//*[contains(@class, 'list-group-item-action')]";
        return await this.webUI.evaluateIndex(locator, itemName);
    }
}
