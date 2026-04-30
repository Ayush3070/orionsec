import { clampScore, severityFromConfidence } from "../normalization.js";

/**
 * Mock intel source for demonstration purposes
 * In a real implementation, this would call an actual API
 */
export async function fetchMockSource({ indicator, type }) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Generate deterministic but varied results based on indicator
  // This ensures same indicator gets same score for demo purposes
  let hash = 0;
  for (let i = 0; i < indicator.length; i++) {
    hash = indicator.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Normalize hash to 0-100 range
  const confidence = clampScore(Math.abs(hash) % 101);
  
  // Determine issue based on type
  let issue = "";
  if (type === "ip") {
    issue = `Mock threat intelligence detected for IP ${indicator}`;
  } else if (type === "domain") {
    issue = `Mock threat intelligence detected for domain ${indicator}`;
  } else {
    issue = `Mock threat intelligence detected for ${indicator}`;
  }
  
  return {
    name: "MockSource",
    confidence,
    severity: severityFromConfidence(confidence),
    details: `This is a mock intelligence source. Confidence score: ${confidence}%.`,
    raw: {
      indicator,
      type,
      timestamp: new Date().toISOString(),
      hash: Math.abs(hash)
    }
  };
}