const { Builder } = require('selenium-webdriver');
const { describe, it, before, after } = require('mocha');
const assert = require('assert');
const fs = require('fs');

const LoginPage = require('../components/LoginPage');
const DashboardPage = require('../components/DashboardPage');
const CartPage = require('../components/CartPage');
const CheckoutPage = require('../components/CheckoutPage');

require('dotenv').config();
const browser = process.env.BROWSER;
const baseUrl = process.env.BASE_URL;
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;
const item = process.env.ITEM;
const fname = process.env.FNAME;
const lname = process.env.LNAME;
const zip = process.env.ZIP;

const screenshotsDir = './screenshots/';
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, {recursive: true});
}

describe('TC-4 [Checkout] #Regression #Smoke', function () {
    this.timeout(130000); // Set timeout for async operations
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

        const dashboardPage = new DashboardPage(driver); // Initialize page
        await dashboardPage.addToCart(`add-to-cart-${item}`); // Add item to Cart

        const cartPage = new CartPage(driver); // Initialize cart page
        cartPage.navigate(); // Navigate to checkout
    });

    it('checkout success', async function () {
        const checkoutPage = new CheckoutPage(driver); // Initialize checkout page
        checkoutPage.information(fname, lname, zip); // Input shipping information

        checkoutPage.navigate(); // Navigate to total
        const title = await checkoutPage.completedCheckout(); // Navigate to final page

        assert.strictEqual(title, 'Checkout: Complete!', 'Expected dashboard title to be "Checkout: Complete!"');
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
