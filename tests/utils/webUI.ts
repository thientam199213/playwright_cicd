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

    async clickAndDragElement(sourceLocator: string, targetLocator: string): Promise<void> {
        const source = await this.page.locator(sourceLocator);
        const target = await this.page.locator(targetLocator);
        await source.waitFor({ state: 'visible' });
        await target.waitFor({ state: 'visible' });
        const sourceBox = await source.boundingBox();
        const targetBox = await target.boundingBox();
        if (sourceBox && targetBox) {
            await this.page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
            await this.page.mouse.down();
            await this.page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 10 });
            await this.page.mouse.up();
        }
    }

    async evaluateIndex(locator: string, sourceItem: string): Promise<number> {
        const items = await this.page.locator(locator);

        const count = await items.count();
        let index = -1;

        for (let i = 0; i < count; i++) {
            const text = await items.nth(i).textContent();
            if (text?.trim() === sourceItem) {
                index = i;
                break;
            }
        }
        return index;
    }
}
