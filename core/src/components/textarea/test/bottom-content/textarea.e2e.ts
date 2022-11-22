import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('textarea: bottom content', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test('should not render bottom content if no hint or counter is enabled', async ({ page, skip }) => {
    skip.mode('ios', 'Rendering is the same across modes');
    await page.setContent(`<ion-textarea label="my textarea"></ion-textarea>`);

    const bottomEl = page.locator('ion-textarea .item-bottom');
    await expect(bottomEl).toHaveCount(0);
  });
  test('entire textarea component should render correctly with no fill', async ({ page }) => {
    await page.setContent(`
      <ion-textarea value="hi@ionic.io" label="Email" helper-text="Enter an email" maxlength="20" counter="true"></ion-textarea>
    `);
    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-full-bottom-no-fill-${page.getSnapshotSettings()}.png`
    );
  });
  test('entire textarea component should render correctly with solid fill', async ({ page }) => {
    await page.setContent(`
      <ion-textarea fill="solid" value="hi@ionic.io" label="Email" helper-text="Enter an email" maxlength="20" counter="true"></ion-textarea>
    `);
    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(`textarea-full-bottom-solid-${page.getSnapshotSettings()}.png`);
  });
  test('entire textarea component should render correctly with outline fill', async ({ page }) => {
    await page.setContent(`
      <ion-textarea fill="outline" value="hi@ionic.io" label="Email" helper-text="Enter an email" maxlength="20" counter="true"></ion-textarea>
    `);
    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-full-bottom-outline-${page.getSnapshotSettings()}.png`
    );
  });
});

test.describe('textarea: hint text', () => {
  test.describe('textarea: hint text functionality', () => {
    test.beforeEach(({ skip }) => {
      skip.rtl();
      skip.mode('ios', 'Rendering is the same across modes');
    });
    test('helper text should be visible initially', async ({ page }) => {
      await page.setContent(
        `<ion-textarea helper-text="my helper" error-text="my error" label="my textarea"></ion-textarea>`
      );

      const helperText = page.locator('ion-textarea .helper-text');
      const errorText = page.locator('ion-textarea .error-text');
      await expect(helperText).toBeVisible();
      await expect(helperText).toHaveText('my helper');
      await expect(errorText).toBeHidden();
    });
    test('error text should be visible when textarea is invalid', async ({ page }) => {
      await page.setContent(
        `<ion-textarea class="ion-invalid" helper-text="my helper" error-text="my error" label="my textarea"></ion-textarea>`
      );

      const helperText = page.locator('ion-textarea .helper-text');
      const errorText = page.locator('ion-textarea .error-text');
      await expect(helperText).toBeHidden();
      await expect(errorText).toBeVisible();
      await expect(errorText).toHaveText('my error');
    });
    test('error text should change when variable is customized', async ({ page }) => {
      await page.setContent(`
        <style>
          ion-textarea.custom-textarea {
            --highlight-color-invalid: purple;
          }
        </style>
        <ion-textarea class="ion-invalid custom-textarea" label="my label" error-text="my error"></ion-textarea>
      `);

      const errorText = page.locator('ion-textarea .error-text');
      expect(await errorText.screenshot()).toMatchSnapshot(
        `textarea-error-custom-color-${page.getSnapshotSettings()}.png`
      );
    });
  });
  test.describe('textarea: hint text rendering', () => {
    test.describe('regular textareas', () => {
      test('should not have visual regressions when rendering helper text', async ({ page }) => {
        await page.setContent(`<ion-textarea helper-text="my helper" label="my textarea"></ion-textarea>`);

        const bottomEl = page.locator('ion-textarea .input-bottom');
        expect(await bottomEl.screenshot()).toMatchSnapshot(
          `textarea-bottom-content-helper-${page.getSnapshotSettings()}.png`
        );
      });
      test('should not have visual regressions when rendering error text', async ({ page }) => {
        await page.setContent(
          `<ion-textarea class="ion-invalid" error-text="my helper" label="my textarea"></ion-textarea>`
        );

        const bottomEl = page.locator('ion-textarea .input-bottom');
        expect(await bottomEl.screenshot()).toMatchSnapshot(
          `textarea-bottom-content-error-${page.getSnapshotSettings()}.png`
        );
      });
    });
  });
});
test.describe('textarea: counter', () => {
  test.describe('textarea: counter functionality', () => {
    test.beforeEach(({ skip }) => {
      skip.rtl();
      skip.mode('ios', 'Rendering is the same across modes');
    });
    test('should not activate if maxlength is not specified even if bottom content is visible', async ({ page }) => {
      await page.setContent(`
        <ion-textarea label="my label" counter="true" helper-text="helper text"></ion-textarea>
      `);
      const itemCounter = page.locator('ion-textarea .counter');
      await expect(itemCounter).toBeHidden();
    });
    test('default formatter should be used', async ({ page }) => {
      await page.setContent(`
        <ion-textarea label="my label" counter="true" maxlength="20"></ion-textarea>
      `);
      const itemCounter = page.locator('ion-textarea .counter');
      expect(await itemCounter.textContent()).toBe('0 / 20');
    });
    test('custom formatter should be used when provided', async ({ page }) => {
      await page.setContent(`
        <ion-textarea label="my label" counter="true" maxlength="20"></ion-textarea>

        <script>
          const textarea = document.querySelector('ion-textarea');
          textarea.counterFormatter = (inputLength, maxLength) => {
            const length = maxLength - inputLength;
            return length.toString() + ' characters left';
          };
        </script>
      `);

      const textarea = page.locator('ion-textarea textarea');
      const itemCounter = page.locator('ion-textarea .counter');
      expect(await itemCounter.textContent()).toBe('20 characters left');

      await textarea.click();
      await textarea.type('abcde');

      await page.waitForChanges();

      expect(await itemCounter.textContent()).toBe('15 characters left');
    });
  });
  test.describe('textarea: counter rendering', () => {
    test.describe('regular textareas', () => {
      test('should not have visual regressions when rendering counter', async ({ page }) => {
        await page.setContent(`<ion-textarea counter="true" maxlength="20" label="my textarea"></ion-textarea>`);

        const bottomEl = page.locator('ion-textarea .input-bottom');
        expect(await bottomEl.screenshot()).toMatchSnapshot(
          `textarea-bottom-content-counter-${page.getSnapshotSettings()}.png`
        );
      });
    });
  });
});
