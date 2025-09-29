const fs = require('fs');
const PNG = require('pngjs').PNG;
let pixelmatch = require('pixelmatch');
if (pixelmatch && pixelmatch.default) pixelmatch = pixelmatch.default;

const baselinePath = 'baseline/add-asset-dialog-smoke.png';
const currentPath = 'add-asset-dialog-smoke.png';
const outPath = 'add-asset-dialog-diff.png';

if (!fs.existsSync(baselinePath)) {
  console.error('Baseline image not found:', baselinePath);
  process.exit(2);
}
if (!fs.existsSync(currentPath)) {
  console.error('Current image not found:', currentPath);
  process.exit(2);
}

const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
const current = PNG.sync.read(fs.readFileSync(currentPath));

// If dimensions differ, composite both images onto a canvas sized to the max width/height
let width = Math.max(baseline.width, current.width);
let height = Math.max(baseline.height, current.height);

function composeOntoCanvas(src, canvas) {
  // copy src into canvas at 0,0
  for (let y = 0; y < src.height; y++) {
    const srcStart = y * src.width * 4;
    const dstStart = y * canvas.width * 4;
    src.data.copy(canvas.data, dstStart, srcStart, srcStart + src.width * 4);
  }
}

const canvasA = new PNG({width, height});
const canvasB = new PNG({width, height});
// initialize with transparent black (default)
composeOntoCanvas(baseline, canvasA);
composeOntoCanvas(current, canvasB);

const diff = new PNG({width, height});
const mismatched = pixelmatch(canvasA.data, canvasB.data, diff.data, width, height, {threshold: 0.1});
fs.writeFileSync(outPath, PNG.sync.write(diff));
console.log('Mismatch pixels:', mismatched);
console.log('Wrote diff image to', outPath);
