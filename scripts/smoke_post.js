(async () => {
  try {
    const payload = {
      machineName: `SMOKE_NODE_${Date.now()}`,
      category: "servers",
      manufacturer: "SmokeNode",
      modelNumber: "SNODE-1",
      serialNumber: `SN${Math.floor(Math.random()*100000)}`,
      createdBy: "node-smoke",
      updatedBy: "node-smoke",
      location: "Schaumburg IL",
      status: "In Use",
      owner: "Group Administrators",
      os: "Linux",
    };

    console.log('Posting payload:', payload);
    const res = await fetch('http://localhost:9002/api/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log('Response status:', res.status);
    console.log('Response body:', text);
  } catch (err) {
    console.error('Error during smoke POST:', err);
    process.exit(1);
  }
})();
