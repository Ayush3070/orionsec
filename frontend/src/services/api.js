const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function readText(file) {
  return await file.text();
}

export async function scanInputs({ uploadedFiles, pastedLogs }) {
  try {
    if (uploadedFiles && uploadedFiles.length > 0) {
      return await scanFiles(uploadedFiles, pastedLogs);
    } else if (pastedLogs && pastedLogs.trim()) {
      return await scanLogs(pastedLogs);
    }
    return { threats: [], insights: [], summary: null };
  } catch (error) {
    console.error("Scan error:", error);
    throw error;
  }
}

export async function scanCode({ files, codeString, filename }) {
  try {
    // Client-side code scanning
    if (codeString && filename) {
      const { detectCodeVulnerabilities } = await import('../utils/codeScanner.js');
      const threats = detectCodeVulnerabilities(codeString, filename);
      return {
        threats,
        insights: threats.length > 0 ? [`Found ${threats.length} potential code vulnerabilities`] : [],
        summary: { threat_count: threats.length }
      };
    }
    
    // Scan uploaded code files
    if (files && files.length > 0) {
      const { detectCodeVulnerabilities } = await import('../utils/codeScanner.js');
      const allThreats = [];
      
      for (const file of files) {
        const content = await file.text();
        const threats = detectCodeVulnerabilities(content, file.name);
        allThreats.push(...threats);
      }
      
      return {
        threats: allThreats,
        insights: allThreats.length > 0 ? [`Found ${allThreats.length} potential code vulnerabilities in ${files.length} file(s)`] : [],
        summary: { threat_count: allThreats.length, files_scanned: files.length }
      };
    }
    
    return { threats: [], insights: [], summary: null };
  } catch (error) {
    console.error("Code scan error:", error);
    throw error;
  }
}

async function scanFiles(files, logs) {
  const formData = new FormData();
  
  for (const file of files) {
    formData.append('files', file);
  }
  
  if (logs && logs.trim()) {
    formData.append('logs', logs);
  }
  
  const res = await fetch(`${API_BASE_URL}/api/scan/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(body || `Scan failed (${res.status})`);
  }

  const data = await res.json();
  return processScanResponse(data);
}

async function scanLogs(logs) {
  const res = await fetch(`${API_BASE_URL}/api/scan/logs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ logs }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(body || `Log scan failed (${res.status})`);
  }

  const data = await res.json();
  return processScanResponse(data);
}

function processScanResponse(data) {
  if (data.results) {
    const threats = data.results.flatMap(r => r.threats || []);
    const insights = data.results.flatMap(r => r.insights || []);
    return { threats, insights, summary: data.summary };
  }
  
  if (data.threats) {
    return {
      threats: data.threats,
      insights: data.insights || [],
      summary: data.summary || null
    };
  }
  
  return { threats: [], insights: [], summary: null };
}

export async function scanLogsDirect(logs) {
  const res = await fetch(`${API_BASE_URL}/api/scan/logs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ logs }),
  });

  if (!res.ok) {
    throw new Error(`Scan failed (${res.status})`);
  }

  return await res.json();
}

export async function getThreats(filters = {}, limit = 100, skip = 0) {
  const queryParams = new URLSearchParams();
  if (filters.severity) queryParams.append('severity', filters.severity);
  if (filters.type) queryParams.append('type', filters.type);
  queryParams.append('limit', limit.toString());
  queryParams.append('skip', skip.toString());

  const res = await fetch(`${API_BASE_URL}/api/threats?${queryParams.toString()}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch threats (${res.status})`);
  }

  return await res.json();
}

export async function getThreatHistory(indicator, type) {
  const res = await fetch(`${API_BASE_URL}/api/threats/${encodeURIComponent(indicator)}?type=${type}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch threat history (${res.status})`);
  }

  return await res.json();
}

export async function postIntelScan(indicator) {
  const res = await fetch(`${API_BASE_URL}/intel/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ indicator }),
  });

  if (!res.ok) {
    throw new Error(`Scan failed (${res.status})`);
  }

  return await res.json();
}

export async function login(username, password) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error(`Login failed (${res.status})`);
  }

  return await res.json();
}
