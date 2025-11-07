import { Page } from "@playwright/test";

export class WebUI {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async clickOrTabElement(locator: string): Promise<void> {
        // const count = await this.page.locator(locator).count();
        // console.log(`Found ${count} elements for locator: ${locator}`);
        const card = await this.page.locator(locator);
        await card.waitFor({ state: 'visible' });
        await card.scrollIntoViewIfNeeded();

        const viewport = this.page.viewportSize();
        const isMobile = viewport && viewport.width <= 768;

        if (isMobile) {
            const box = await card.boundingBox();
            if (box) {
                await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
                await this.page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
            } else {
                await card.tap();
            }
        } else {
            await card.click({ timeout: 5000 });
        }
    }
}
