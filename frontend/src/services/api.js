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

export async function getThreatHistory(indicator, type) {
  try {
    const res = await fetch(`${API_BASE_URL}/threats/history/${encodeURIComponent(indicator)}?type=${type}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(body || `Failed to fetch threat history (${res.status})`);
    }

    return await res.json();
  } catch (error) {
    throw error;
  }
}

export async function getThreats(filters = {}, limit = 100, skip = 0) {
  try {
    const queryParams = new URLSearchParams();
    if (filters.severity) queryParams.append('severity', filters.severity);
    if (filters.type) queryParams.append('type', filters.type);
    queryParams.append('limit', limit.toString());
    queryParams.append('skip', skip.toString());

    const res = await fetch(`${API_BASE_URL}/threats?${queryParams.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(body || `Failed to fetch threats (${res.status})`);
    }

    return await res.json();
  } catch (error) {
    throw error;
  }
}

export async function getIntelHistory() {
  try {
    const res = await fetch(`${API_BASE_URL}/intel/history`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(body || `Failed to fetch intel history (${res.status})`);
    }

    return await res.json();
  } catch (error) {
    throw error;
  }
}

export async function postIntelScan(indicators) {
  try {
    const res = await fetch(`${API_BASE_URL}/intel/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ indicators }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(body || `Scan failed (${res.status})`);
    }

    return await res.json();
  } catch (error) {
    throw error;
  }
}

export async function getIntelHistory() {
  try {
    const res = await fetch(`${API_BASE_URL}/intel/history`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(body || `Failed to fetch intel history (${res.status})`);
    }

    return await res.json();
  } catch (error) {
    throw error;
  }
}

