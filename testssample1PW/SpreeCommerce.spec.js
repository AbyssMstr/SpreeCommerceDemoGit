//import { test, expect } from '@playwright/test';
const {test, expect} = require ('@playwright/test');
const testdatajson = JSON.parse(JSON.stringify(require("../test-data/loginData.json")))
const testvalidationjson = JSON.parse(JSON.stringify(require("../test-data/validationData.json")))

test('test', async ({ page }) => {
  //Sign-up
  await page.goto('https://demo.spreecommerce.org/us/en');
  await expect(page).toHaveTitle(/.*Spree Commerce.*/);
  await page.getByRole('link', { name: 'Account', exact: true }).click();
  await page.getByRole('main').getByText('My Account').click();
  await page.getByRole('link', { name: 'Sign up' }).click();
  await page.getByRole('textbox', { name: 'First name' }).fill(testdatajson.fName);
  await page.getByRole('textbox', { name: 'Last name' }).fill(testdatajson.lName);
  await page.getByRole('textbox', { name: 'Email Email' }).fill(testdatajson.Email);
  await page.getByRole('textbox', { name: 'Password Password' }).fill(testdatajson.PassW);
  await page.getByRole('textbox', { name: 'Confirm Password' }).fill(testdatajson.PassW);
  await page.getByRole('checkbox', { name: 'I agree to the Privacy Policy' }).click();
  await page.getByRole('button', { name: 'Create Account' }).click();
  //Verify Account Overview is Displayed
  await expect(page.locator("//h1[normalize-space()='Account Overview']")).toHaveText(testvalidationjson.labelOvervew);
  await page.getByRole('button', { name: 'Sign Out' }).click();
  
  //Login
  //Verify My Account is Displayed
  await expect(page.locator("//div[@class='text-2xl font-bold leading-none']")).toHaveText(testvalidationjson.labelAccount)
  await page.getByRole('textbox', { name: 'Email' }).fill(testdatajson.Email);
  await page.getByRole('textbox', { name: 'Password' }).fill(testdatajson.PassW);
  await page.getByRole('button', { name: 'Sign In' }).click();
  //Verify Account Overview is Displayed
  await expect(page.locator("//h1[normalize-space()='Account Overview']")).toHaveText(testvalidationjson.labelOvervew)
  
  //Add Product to Cart
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('link', { name: 'All Products' }).click();
  await page.getByRole('link', { name: 'Digital Air Fryer 6.2L' }).click();
  await page.getByRole('button', { name: 'Add to Cart' }).click();
  await page.getByRole('link', { name: 'View Cart' }).click();
  await page.getByRole('heading', { name: 'Shopping Cart' }).click();
  //Verify Order Summary
  await expect(page.locator("//h2[normalize-space()='Order Summary']")).toHaveText(testvalidationjson.labelSummary)
  
  
  //Proceed Checkout
  await page.getByRole('link', { name: 'Proceed to Checkout' }).click();
  //Verify Shipping Address is Displayed
  const locator = page.locator("//h2[normalize-space()='Shipping Address']");
  await locator.waitFor({ state: 'attached', timeout: 10000 });
  await expect(page.locator("//h2[normalize-space()='Shipping Address']")).toHaveText(testvalidationjson.labelShipAdd)
  
  await page.getByLabel('Country').selectOption('US');
  await page.getByRole('textbox', { name: 'Company (optional)' }).fill(testdatajson.CompanyVal);
  await page.getByRole('textbox', { name: 'Address', exact: true }).fill(testdatajson.AddressVal);
  await page.getByRole('textbox', { name: 'Apartment, suite, etc. (' }).fill(testdatajson.ApartVal);
  await page.getByRole('textbox', { name: 'City' }).fill(testdatajson.CityVal);
  await page.getByLabel('State / Province').selectOption(testdatajson.StateVal);
  await page.getByRole('textbox', { name: 'ZIP / Postal code' }).fill(testdatajson.ZIPVal);
  await page.getByRole('textbox', { name: 'Phone (optional)' }).fill(testdatajson.Phone);
  await page.getByRole('heading', { name: 'Shipping Method' }).click();
  await page.getByRole('radio', { name: 'Premium $' }).click();

  // Card number
  await expect(page.getByText('Same as shipping address', { exact: true })).toBeVisible();
  await page.waitForTimeout(3000);
  await page.pause()
  //This part I can't figure out
  //await page.locator("button#affirm-tab div.p-TabIconContainer").click();
  //await page.locator('#affirm-tab').waitFor({ state: 'visible' });
  //await page.locator('#affirm-tab').dblclick();
  //await page.getByTestId('afterpay_clearpay').click();
  await page.getByRole('button', { name: 'Pay Now' }).click();
  await page.getByTestId('authorize-test-payment-button').waitFor({ state: 'visible' });
  await page.getByTestId('authorize-test-payment-button').click();
  //Verify Order Completion
  await expect(page.getByRole("heading", { name: /Thanks for your order.*/ })).toBeVisible({ timeout: 10000 }); 
  await expect(page.getByText(/Order #R\d+/)).toBeVisible({ timeout: 10000 });

  
});

