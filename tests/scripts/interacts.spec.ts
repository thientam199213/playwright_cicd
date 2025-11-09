import test, { expect } from "@playwright/test";
import { InteractionsPage } from "../pages/InteractionsPage";
import { WebUI } from "../utils/webUI";

test.describe('Verify interactions page', () => {
    let interactionPage: InteractionsPage;
    let webUI: WebUI

    test.beforeEach(async ({ page }) => {
        interactionPage = new InteractionsPage(page);
        webUI = new WebUI(page);
        await interactionPage.goto();
    });
    const testCases = [
        { menuName: "Sortable", expectedDom: "//h1[@class='text-center']" },
        { menuName: "Selectable", expectedDom: "//h1[@class='text-center']" },
        { menuName: "Resizable", expectedDom: "//h1[@class='text-center']" },
        { menuName: "Droppable", expectedDom: "//h1[@class='text-center']" },
        { menuName: "Dragabble", expectedDom: "//h1[@class='text-center']" }
    ];

    for (const { menuName, expectedDom } of testCases) {
        test(`should allow me to open the ${menuName} menu`, async () => {
            await interactionPage.selectMenu(menuName);
            const title = await interactionPage.page.locator(expectedDom).innerText();
            expect(title).toBe(menuName);
            // await expect(interactionPage.page).toHaveURL(expectedUrl);
        });
    }

    test("should allow me drag and drop the sortable list", async () => {
        await interactionPage.selectMenu("Sortable");
        await interactionPage.moveItemInTheSortable("demo-tabpane-list", "One", "Three");

        try {
            await expect(interactionPage.getItemIndexInSortable("demo-tabpane-list", "One")).not.toBe(1);
        } catch (e) {
            await interactionPage.page.screenshot({ path: 'screenshots/failure.png', fullPage: true });
            throw e; // rethrow to mark the test as failed
        }
    });

    test("should allow me drag and drop the sortable Grid", async () => {
        await interactionPage.selectMenu("Sortable");
        await interactionPage.selectTab("demo-tab-grid");
        await interactionPage.moveItemInTheSortable("demo-tabpane-grid", "One", "Three");


        try {
            await expect(interactionPage.getItemIndexInSortable("demo-tabpane-grid", "One")).not.toBe(1);
        } catch (e) {
            await interactionPage.page.screenshot({ path: 'screenshots/failure.png', fullPage: true });
            throw e; // rethrow to mark the test as failed
        }
    });

    test.only("should allow me to resize the restrict box", async () => {
        await interactionPage.selectMenu("Resizable");
        await interactionPage.moveElementInTheResizable("resizableBoxWithRestriction", 600, 350);
        // Add assertions as needed to verify the resize action

        await webUI.getElementStyleProperty("//*[@id='resizableBoxWithRestriction']", "width").then((width) => {
            expect(parseInt(width)).toBe(500);
        });
        await webUI.getElementStyleProperty("//*[@id='resizableBoxWithRestriction']", "height").then((height) => {
            expect(parseInt(height)).toBe(300);
        });

    });

    test.only("should allow me to resize the free box", async () => {
        await interactionPage.selectMenu("Resizable");
        await interactionPage.moveElementInTheResizable("resizable", 400, 250);

        await webUI.getElementStyleProperty("//*[@id='resizable']", "width").then((width) => {
            expect(parseInt(width)).toBe(600);
        });
        await webUI.getElementStyleProperty("//*[@id='resizable']", "height").then((height) => {
            expect(parseInt(height)).toBe(450);
        });

    });
});
