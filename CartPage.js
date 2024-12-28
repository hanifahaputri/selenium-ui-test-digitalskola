const { By } = require('selenium-webdriver');

class CartPage {
    constructor(driver) {
        this.driver = driver;
    }

    async findItem() {
        // Find item based on its class name 
        const cartItem = await this.driver.findElement(By.className('inventory_item_name'));
        return cartItem.getText();
    }
}

module.exports = CartPage;