import { test, expect } from '@playwright/test';

test('has FLEDGE', async ({ page }) => {
  await page.goto('https://repurposingjunkie.com/?at_features=%7B"fldg"%3Atrue%7D');

  await page.waitForTimeout(1000);

  page.on('console', msg => {
    console.log(`Console message: ${msg.text()}`);
  });

  // Check for the presence of navigator.joinAdInterestGroup
  const isFledgeEnabled = await page.evaluate(async () => {
    const isJoinAdInterestGroupPresent = typeof (navigator as any).joinAdInterestGroup === 'function';
    const isJoinAdInterestGroupAllowed = (document as any).featurePolicy?.allowsFeature('join-ad-interest-group');
    const isRunAdAuctionAllowed = (document as any).featurePolicy?.allowsFeature('run-ad-auction');
    const isAdthriveFledgeEnabled = (window as any).adthrive?.config.fledge.enabled;
    const isPrebidFledgeEnabled = (window as any).pbjs?.getConfig('fledgeForGpt')?.enabled;

    console.log('isJoinAdInterestGroupPresent', isJoinAdInterestGroupPresent);
    console.log('isJoinAdInterestGroupAllowed', isJoinAdInterestGroupAllowed);
    console.log('isRunAdAuctionAllowed', isRunAdAuctionAllowed);
    console.log('CookieDeprecationLabel', await (navigator as any).cookieDeprecationLabel?.getValue() ?? '(empty string)');
    console.log('isAdthriveFledgeEnabled', isAdthriveFledgeEnabled);
    console.log('isPrebidFledgeEnabled', isPrebidFledgeEnabled);

    return isJoinAdInterestGroupPresent && isJoinAdInterestGroupAllowed && isRunAdAuctionAllowed && isAdthriveFledgeEnabled && isPrebidFledgeEnabled;
  });

  // Assert that navigator.joinAdInterestGroup is present
  expect(isFledgeEnabled).toBe(true);
});
