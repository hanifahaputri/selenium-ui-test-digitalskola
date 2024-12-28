const { Builder } = require('selenium-webdriver');
const { describe, it, before, after } = require('mocha');
const assert = require('assert');

const LoginPage = require('../components/LoginPage');
const DashboardPage = require('../components/DashboardPage');
const CartPage = require('../components/CartPage');


describe('SauceDemoTest', function () {
    this.timeout(40000); // Set timeout for async operations
    let driver;

    before(async function () {
        // Initialize WebDriver before passing it to the pages
        driver = await new Builder().forBrowser('chrome').build();

        const loginPage = new LoginPage(driver); 

        await loginPage.navigate(); 
        await loginPage.login('standard_user', 'secret_sauce'); // Perform login
    });

    it('should login successfully and verify dashboard', async function () {
        // Initialize the DashboardPage with the driver
        const dashboardPage = new DashboardPage(driver); 
        const title = await dashboardPage.isOnDashboard();

        assert.strictEqual(title, 'Products', 'Expected dashboard title to be Products');
    });

    it('check if item has been added to cart', async function () {
        const dashboardPage = new DashboardPage(driver); // Initialize page

        // Add item to cart, item can be changed according to assertion
        const addToCart = await dashboardPage.addToCart('add-to-cart-sauce-labs-backpack'); 
        
        const cartPage = new CartPage(driver); // Navigate to cart page
        const cartItem = await cartPage.findItem(); // Find item that has been added to cart
        
        assert.strictEqual(cartItem, 'Sauce Labs Backpack', 'Item name in cart is incorrect');
    });

    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });
});
