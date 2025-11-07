import { Given, When, Then, setDefaultTimeout, BeforeAll, After, AfterAll, Before } from "@cucumber/cucumber";
import { chromium, Browser, Page, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import assert from "assert";

// setDefaultTimeout(60 * 1000); // increase global timeout

let browser: Browser;
let page: Page;
let homePage: HomePage;

Before(async function () {
    // setDefaultTimeout(60 * 1000); // increase global timeout
    // You can put any setup code here if needed before all tests
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    page = await context.newPage();
    homePage = new HomePage(page);
});

Given("I go to the home page", async function () {
    await homePage.goto();
});

When("I select the {string}", async function (cardName: string) {
    await homePage.selectCard(cardName);
});

Then("I should see the redirect page", async function () {
    let currentURL = page.url
    expect(currentURL).not.toBe("https://demoqa.com/");
    assert.notEqual(currentURL, "https://demoqa.com/", "The URL should have changed from the home page");
    // await browser.close();
});

After(async function () {
    // You can put any teardown code here if needed after each scenario
    // For example, closing the browser if it's not already closed
    if (browser) {
        await browser.close();
    }
});
