const { Builder } = require('selenium-webdriver');
const { describe, it, before, after } = require('mocha');
const assert = require('assert');
const fs = require('fs');

const LoginPage = require('../components/LoginPage');
const DashboardPage = require('../components/DashboardPage');

require('dotenv').config();
const browser = process.env.BROWSER;
const baseUrl = process.env.BASE_URL;
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;

const screenshotsDir = './screenshots/';
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, {recursive: true});
}

describe('TC-1 [Login] #Regression #Smoke', function () {
    this.timeout(40000); // Set timeout for async operations
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

    it('should login successfully and verify dashboard', async function () {
        // Initialize the DashboardPage with the driver
        const dashboardPage = new DashboardPage(driver); 
        const title = await dashboardPage.isOnDashboard();

        assert.strictEqual(title, 'Products', 'Expected dashboard title to be Products');
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
