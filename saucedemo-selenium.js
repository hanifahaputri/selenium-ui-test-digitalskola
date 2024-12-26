const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sauceDemoTest() {
    // Create connection with the browser driver
    let driver = await new Builder().forBrowser('chrome').build();
    
    try {
        await driver.get('http://www.saucedemo.com/');

        // Input username and password
        await driver.findElement(By.id('user-name')).sendKeys('standard_user');
        await driver.findElement(By.id('password')).sendKeys('secret_sauce');

        await sleep(1000); 
        
        // Click Login button
        await driver.findElement(By.id('login-button')).click();

        // Assert we are at the dashboard by looking for the title "Swag Labs"
        let titleText = await driver.findElement(By.className('app_logo')).getText();
        assert.strictEqual(titleText.includes('Swag Labs'), true, "Title does not contain 'Swag Labs'");
        
        await sleep(1000); 
        
        // Assert we are at the dashboard by looking for "burger button"
        let menuButton = await driver.findElement(By.id('react-burger-menu-btn'));
        assert.strictEqual(await menuButton.isDisplayed(), true, "Menu button is not visible");
        
        await sleep(1000); 

        console.log("Validation Passed: Login success.");

        // Add item to cart
        await driver.findElement(By.id('add-to-cart-sauce-labs-bike-light')).click();

        await sleep(1000); 

        // Validate the cart badge shows 1 itme
        let cartBadge = await driver.findElement(By.className('shopping_cart_badge'));
        let cartBadgeText = await cartBadge.getText();

        assert.strictEqual(cartBadgeText, '1', 'Cart badge does not show 1 item');

        await sleep(1000); 

        // Navigate to the cart and validate the item is listed
        await driver.findElement(By.className('shopping_cart_link')).click();

        let cartItem = await driver.findElement(By.className('inventory_item_name')).getText();
        assert.strictEqual(cartItem, 'Sauce Labs Bike Light', 'Item name in cart is incorrect');
        await sleep(1000); 

        console.log("Validation Passed: Item successfully added to the cart.");
        
    } 
    finally {
        await driver.quit();
    }
}

sauceDemoTest();
