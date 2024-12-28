const { By } = require('selenium-webdriver');

class DashboardPage {
    constructor(driver) {
        this.driver = driver;
    }

    async isOnDashboard() {
        // Find title of the page
        const title = await this.driver.findElement(By.className('title'));
        return title.getText();
    }

    async addToCart(elementName) {
        // Find item based on a certain element's name
        const item = await this.driver.findElement(By.id(elementName)).click();
        return "Item added";
    }
}

module.exports = DashboardPage;