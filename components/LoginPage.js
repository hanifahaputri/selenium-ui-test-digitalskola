const { By } = require('selenium-webdriver');

require('dotenv').config();  // Load environment variables

class LoginPage {
    constructor(driver) {
        this.driver = driver;
        this.usernameInput = By.id('user-name');
        this.passwordInput = By.css('input[placeholder="Password"]');
        this.loginButton = By.xpath('//input[@value="Login"]');
        this.baseUrl = process.env.BASE_URL;  // Get BASE_URL from environment variables
    }

    async navigate(url) {
        // Use BASE_URL for the login page
        await this.driver.get(`${url}/`);
    }

    async login(username, password) {
        await this.driver.findElement(this.usernameInput).sendKeys(username);
        await this.driver.findElement(this.passwordInput).sendKeys(password);
        await this.driver.findElement(this.loginButton).click();
    }
}

module.exports = LoginPage;
