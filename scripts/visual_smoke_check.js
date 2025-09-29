// scripts/visual_smoke_check.js
// Requires: npm install --save-dev playwright
// Usage: node scripts/visual_smoke_check.js

const { chromium } = require('playwright');
const http = require('http');

function waitForServer(url, timeout = 15000, interval = 500) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    (function check() {
      const req = http.get(url, res => {
        res.destroy();
        resolve();
      });
      req.on('error', () => {
        if (Date.now() - start > timeout) return reject(new Error('Timeout waiting for server'));
        setTimeout(check, interval);
      });
    })();
  });
}

(async () => {
  await waitForServer('http://localhost:9002', 20000, 500);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('http://localhost:9002');

  console.log('Page loaded successfully.');
  
  await browser.close();
})();
