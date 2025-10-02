import { device, element, by, expect as detoxExpect } from 'detox';

describe('Smoke Test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show welcome screen', async () => {
    await detoxExpect(
      element(by.text('Open up App.tsx to start working on your app!'))
    ).toBeVisible();
  });

  it('should navigate through basic app flow', async () => {
    // Basic smoke test - app starts and renders
    await detoxExpect(element(by.id('app-container'))).toBeVisible();
  });
});
