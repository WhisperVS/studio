(async () => {
  const fs = require('fs');
  const body = fs.readFileSync('./payload.json', { encoding: 'utf8' });
  const res = await fetch('http://localhost:9002/api/assets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  console.log('STATUS:', res.status);
  const t = await res.text();
  console.log(t);
})();
