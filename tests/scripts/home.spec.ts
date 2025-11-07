import test, { expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

test.describe('Verify home navigation', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.goto();
    });
    const testCases = [
        { card: "Elements", expectedUrl: /.*elements/ },
        { card: "Forms", expectedUrl: /.*forms/ },
        { card: "Alerts, Frame & Windows", expectedUrl: /.*alertsWindows/ },
        { card: "Widgets", expectedUrl: /.*widgets/ },
        { card: "Interactions", expectedUrl: /.*interaction/ },
        { card: "Book Store Application", expectedUrl: /.*books/ },
    ];

    for (const { card, expectedUrl } of testCases) {
        test(`should allow me to navigate to ${card} detail`, async () => {
            await homePage.selectCard(card);
            await expect(homePage.page).toHaveURL(expectedUrl);
        });
    }
});
