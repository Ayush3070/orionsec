const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function readText(file) {
  return await file.text();
}

export async function scanInputs({ uploadedFiles, pastedLogs }) {
  const files = [];
  for (const file of uploadedFiles) {
    files.push({ name: file.name, content: await readText(file) });
  }

  const payload = {
    files,
    logs: pastedLogs || "",
  };

  const res = await fetch(`${API_BASE_URL}/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(body || `Scan failed (${res.status})`);
  }

  const data = await res.json();

  if (Array.isArray(data)) return { threats: data, insights: [] };
  if (data && Array.isArray(data.threats)) return { threats: data.threats, insights: Array.isArray(data.insights) ? data.insights : [] };
  return { threats: [], insights: [] };
}

