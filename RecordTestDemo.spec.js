const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();
  await page.getByRole('radio', { name: 'Premium $' }).click();
  await page.getByText('Loading payment form...').click();
  await page.locator('iframe[name="__privateStripeFrame40134"]').contentFrame().getByRole('textbox', { name: 'Card number' }).click();

  // ---------------------
  await context.close();
  await browser.close();
})();