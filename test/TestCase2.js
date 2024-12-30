const { Builder } = require('selenium-webdriver');
const { describe, it, before, after } = require('mocha');
const assert = require('assert');
const fs = require('fs');

const LoginPage = require('../components/LoginPage');
const DashboardPage = require('../components/DashboardPage');
const CartPage = require('../components/CartPage');

require('dotenv').config();
const browser = process.env.BROWSER;
const baseUrl = process.env.BASE_URL;
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;
const item = process.env.ITEM;

const screenshotsDir = './screenshots/';
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, {recursive: true});
}

describe('TC-2 [Add to Cart] #Regression #Smoke', function () {
    this.timeout(85000); // Set timeout for async operations
    let driver;

    switch (browser.toLowerCase()) {
        case 'firefox':
            const firefox = require('selenium-webdriver/firefox');
            options = new firefox.Options();
            options.addArguments('--headless');
        break;
        case 'edge':
            const edge = require('selenium-webdriver/edge');
            options = new edge.Options();
            options.addArguments('--headless');
        break;
        case 'chrome':
            const chrome = require('selenium-webdriver/chrome');
            options = new chrome.Options();
            options.addArguments('--headless');
        break;
    }

    before(async function () {
        // Initialize WebDriver before passing it to the pages
        driver = await new Builder().forBrowser(browser).setChromeOptions(options).build();

        const loginPage = new LoginPage(driver); 

        await loginPage.navigate(baseUrl); 
        await loginPage.login(username, password); // Perform login
    });

    it('check if item has been added to cart', async function () {
        const dashboardPage = new DashboardPage(driver); // Initialize page

        // Add item to cart, item can be changed according to assertion
        await dashboardPage.addToCart(`add-to-cart-${item}`); // Add item to Cart
        
        const cartPage = new CartPage(driver); // Navigate to cart page
        const cartItem = await cartPage.findItem(); // Find item that has been added to cart
        
        assert.strictEqual(cartItem, 'Sauce Labs Backpack', 'Item name in cart is incorrect');
    });

    afterEach(async function() {
        const screenshot = await driver.takeScreenshot();
        const filepath = `${screenshotsDir}${this.currentTest.title.replace(/\s+/g, '_')}_${Date.now()}.png`;
        console.log("Writing to:", filepath);
        fs.writeFileSync(filepath, screenshot, 'base64');
    }
)

    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });
});