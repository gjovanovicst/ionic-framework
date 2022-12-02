import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ modes: ['md'] }).forEach(({ title, config }) => {
  test(title('should not have visual regressions'), async ({ page }) => {
    await page.goto(`/src/components/grid/test/basic`, config);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`grid-basic-${page.getSnapshotSettings()}.png`);
  });
});
