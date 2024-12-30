const { By } = require('selenium-webdriver');

require('dotenv').config();  // Load environment variables

class CheckoutPage {
    constructor(driver) {
        this.driver = driver;
        this.firstname = By.css('input[placeholder="First Name"]');
        this.lastname = By.css('input[placeholder="Last Name"]');
        this.zipcode = By.css('input[placeholder="Zip/Postal Code"]');
        this.checkout = By.xpath('//input[@value="Continue"]');
        this.baseUrl = process.env.BASE_URL;  // Get BASE_URL from environment variables
    }

    async information(first, last, postal) {
        await this.driver.findElement(this.firstname).sendKeys(first);
        await this.driver.findElement(this.lastname).sendKeys(last);
        await this.driver.findElement(this.zipcode).sendKeys(postal);
        await this.driver.findElement(this.checkout).click();
    }

    async navigate() {
        // Use BASE_URL along with the path for the checkout complete page
        await this.driver.get(`${this.baseUrl}/checkout-complete.html`);
    }

    async completedCheckout() {
        // Find title of the page
        const title = await this.driver.findElement(By.className('title'));
        return title.getText();        
    }
}

module.exports = CheckoutPage;
