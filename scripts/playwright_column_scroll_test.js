// scripts/playwright_column_scroll_test.js
// Usage: node scripts/playwright_column_scroll_test.js
// Requires Playwright to be installed locally or inside the image

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:9002');

  // use a wide viewport so responsive-hidden columns become visible (md/lg/xl breakpoints)
  await page.setViewportSize({ width: 1600, height: 900 });

  // Open View / Toggle columns menu (adjust selector if needed)
  const viewButton = page.locator('button, [role="button"]', { hasText: 'View' }).first();
  await viewButton.click();

  // Optionally try to toggle columns if the UI exposes them. This is best-effort and may be brittle.
  try {
    await page.waitForSelector('text=Toggle columns', { timeout: 1500 });
    // The DropdownMenuCheckboxItem renders as a menuitemcheckbox with aria-checked
    const toggles = page.locator('[role="menuitemcheckbox"]');
    const count = await toggles.count();
    for (let i = 0; i < count; i++) {
      const item = toggles.nth(i);
      const ariaChecked = await item.getAttribute('aria-checked');
      if (ariaChecked !== 'true') {
        await item.click();
      }
    }
  } catch (e) {
    // ignore if the toggle dialog isn't present
  }

  // Apply or close dialog if there's an Apply button
  const applyBtn = page.locator('button', { hasText: 'Apply' }).first();
  if (await applyBtn.count() > 0) await applyBtn.click();

  // Wait for table to update
  await page.waitForTimeout(500);

  // Check for horizontal scrollbar on the table container
  // Detect the nearest scrollable ancestor of the table and use it for horizontal scroll checks
  let hasHScroll = false;
  const table = await page.$('table');
  if (table) {
    const result = await page.evaluate((tbl) => {
      function findScrollableAncestor(el) {
        let node = el;
        while (node && node !== document.body) {
          if (node.scrollWidth > node.clientWidth) return node;
          node = node.parentElement;
        }
        return el;
      }
      const scrollable = findScrollableAncestor(tbl);
      return { scrollWidth: scrollable.scrollWidth, clientWidth: scrollable.clientWidth, hasRibbon: !!document.querySelector('.ribbon-spacer') };
    }, table);
    hasHScroll = result.scrollWidth > result.clientWidth;
  }

  // Check ribbon presence
  const ribbon = await page.$('.ribbon-spacer');

  // Check sticky left headers remain visible after horizontal scroll
  const connectHeader = await page.$('th:has-text("Connect")');
  let connectVisible = true;
  if (connectHeader) {
    // scroll horizontally to far right then back on the nearest scrollable ancestor
    await page.evaluate(() => {
      const tbl = document.querySelector('table');
      if (!tbl) return;
      let node = tbl;
      while (node && node !== document.body) {
        if (node.scrollWidth > node.clientWidth) { node.scrollLeft = node.scrollWidth; break; }
        node = node.parentElement;
      }
    });
    await page.waitForTimeout(200);
    connectVisible = await connectHeader.isVisible();
  }

  console.log('hasHScroll:', hasHScroll);
  console.log('ribbon present:', Boolean(ribbon));
  console.log('connect header visible after scroll:', connectVisible);

  // capture screenshot for verification
  try {
    // full page screenshot
    await page.screenshot({ path: 'scripts/asset-table-visual-full.png', fullPage: true });
    console.log('screenshot saved: scripts/asset-table-visual-full.png');
    // screenshot of just the table container (if present)
    const tableContainer = await page.$('div:has(table)');
    if (tableContainer) {
      const box = await tableContainer.boundingBox();
      if (box) {
        await page.screenshot({ path: 'scripts/asset-table-visual-table.png', clip: { x: Math.max(box.x,0), y: Math.max(box.y,0), width: Math.min(box.width, 32767), height: Math.min(box.height, 32767) } });
        console.log('screenshot saved: scripts/asset-table-visual-table.png');
      }
    }
  } catch (e) {
    console.warn('failed to capture screenshot', e);
  }

  await browser.close();
  process.exit(hasHScroll && ribbon && connectVisible ? 0 : 1);
})();
