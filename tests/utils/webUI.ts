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

    async resizeBoxElement(boxLocator: string, offsetX: number, offsetY: number): Promise<void> {
        const handle = await this.page.locator(boxLocator);
        await handle.waitFor({ state: 'visible' });
        // handle.dragTo(handle, { targetPosition: { x: offsetX, y: offsetY } });
        const box = await handle.boundingBox();
        if (!box) throw new Error("Handle bounding box not found");

        await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await this.page.mouse.down();
        await this.page.mouse.move(box.x + 300, box.y + 150, { steps: 10 }); // drag
        await this.page.mouse.up();
    }

    /**
     * Resize an element by dragging its resize handle.
     * @param handleLocator XPath or CSS selector of the resize handle.
     * @param dx Offset in X direction (positive = right, negative = left).
     * @param dy Offset in Y direction (positive = down, negative = up).
     */
    async resizeElement(handleLocator: string, dx: number, dy: number): Promise<void> {
        const handle = this.page.locator(handleLocator);

        // Ensure handle exists and visible
        await handle.waitFor({ state: "visible" });
        await handle.scrollIntoViewIfNeeded();
        await this.page.waitForLoadState("domcontentloaded");

        const box = await handle.boundingBox();
        if (!box) {
            throw new Error(`Resize handle not found: ${handleLocator}`);
        }

        // Start drag from the bottom-right corner (most UI libraries resize from here)
        const startX = box.width - 2;
        const startY = box.height - 2;

        console.log(`Before resize:`, box);
        console.log(`Dragging from (${startX}, ${startY}) with delta (${dx}, ${dy})`);
        await this.page.waitForTimeout(1000);  // ⭐ stabilizes headless mode

        // Use Playwright's built-in stable drag
        await handle.dragTo(handle, {
            sourcePosition: { x: startX, y: startY },
            targetPosition: { x: startX + dx, y: startY + dy },
            force: true,
            timeout: 10000
        });

        // Wait for animations / layout stabilization
        await this.page.waitForTimeout(3000);

        // Log updated size
        const after = await handle.boundingBox();
        console.log(`After resize:`, after);
    }



    async getElementStyleProperty(locator: string, property: string): Promise<string | null> {
        const element = await this.page.locator(locator);
        return await element.evaluate((el, prop) => {
            return window.getComputedStyle(el).getPropertyValue(prop);
        }, property);
    }
}
