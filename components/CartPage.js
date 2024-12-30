const { By } = require('selenium-webdriver');

require('dotenv').config();  // Load environment variables

class CartPage {
    constructor(driver) {
        this.driver = driver;
        this.baseUrl = process.env.BASE_URL;  // Get BASE_URL from environment variables
    }

    async navigate() {
        // Use BASE_URL along with the path for the cart page
        await this.driver.get(`${this.baseUrl}/checkout-step-one.html`);
    }

    async findItem() {
        // Find item based on its class name 
        const cartItem = await this.driver.findElement(By.className('inventory_item_name'));
        return cartItem.getText();
    }

    async removeFromCart(id) {
        const item = await this.driver.findElement(By.id(id)).click();
        return item;
    }
}

module.exports = CartPage;
