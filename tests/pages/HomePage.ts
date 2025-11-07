import { Page } from "@playwright/test";

export class HomePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto("https://demoqa.com/", {
            waitUntil: "domcontentloaded",
            timeout: 60000
        });
    }

    async selectCard(cardName: string) {
        const card = this.page.locator("//*[@class='home-body']//*[@class='card-body']//*[text()='" + cardName + "']");
        await card.scrollIntoViewIfNeeded();  // ensure visible on mobile
        await card.waitFor({ state: 'visible' }); // wait until visible
        // await card.click({ timeout: 5000, trial: false }); // retry-safe click

        // Detect mobile viewport
        const viewport = this.page.viewportSize();
        const isMobile = viewport && viewport.width <= 768;

        if (isMobile) {
            // Use touch-like interaction
            const box = await card.boundingBox();
            if (box) {
                await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
                await this.page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
            } else {
                // Fallback if bounding box not available
                await card.tap();
            }
        } else {
            // Desktop click
            await card.click({ timeout: 5000 });
        }
    }
}
