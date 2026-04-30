import cron from 'node-cron';
import { fetchAbuseIPDB } from './services/intel_sources/abuseipdb.js';
import { fetchOTX } from './services/intel_sources/otx.js';
import { fetchMockSource } from './services/intel_sources/mock_source.js';
import { enrichIndicator } from './services/aggregator.js';
import { getDb } from './db.js';

// Configuration
const STALE_THRESHOLDS = {
  high: 300,    // 5 minutes for high severity
  medium: 1800, // 30 minutes for medium severity
  low: 3600     // 1 hour for low severity
};

// List of indicators to monitor (in production, this would come from MongoDB)
const MONITORED_INDICATORS = [
  { indicator: '203.0.113.9', type: 'ip' },
  { indicator: '198.51.100.23', type: 'ip' },
  { indicator: 'example.com', type: 'domain' },
  { indicator: 'malicious-domain.com', type: 'domain' }
];

/**
 * Determine if an indicator is stale based on its severity and last seen time
 */
function isIndicatorStale(lastSeen, severity) {
  if (!lastSeen) return true; // Never seen before, consider stale
  
  const thresholdMs = STALE_THRESHOLDS[severity] * 1000;
  const ageMs = Date.now() - new Date(lastSeen).getTime();
  
  return ageMs > thresholdMs;
}

/**
 * Get the priority order for processing indicators (high severity first)
 */
function getProcessingOrder(indicators) {
  const severityOrder = { high: 3, medium: 2, low: 1 };
  return [...indicators].sort((a, b) => {
    const severityA = severityOrder[a.severity || 'low'] || 0;
    const severityB = severityOrder[b.severity || 'low'] || 0;
    return severityB - severityA; // Descending order (high first)
  });
}

/**
 * Background job to refresh threat intelligence for monitored indicators
 * Only processes stale indicators and prioritizes by severity
 */
async function refreshThreatIntelligence() {
  console.log(`[${new Date().toISOString()}] Starting threat intelligence refresh...`);
  
  try {
    const db = await getDb();
    const threatsCollection = db.collection('threats');
    
    // Get unique indicators from threats collection
    const storedIndicators = await threatsCollection.distinct('indicator');
    
    // Combine monitored indicators with stored ones
    const allIndicators = [
      ...MONITORED_INDICATORS,
      ...storedIndicators.map(indicator => ({ 
        indicator, 
        type: /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/.test(indicator) ? 'ip' : 'domain' 
      }))
    ];
    
    // Remove duplicates based on indicator and type
    const uniqueIndicatorsMap = new Map();
    for (const item of allIndicators) {
      const key = `${item.indicator}:${item.type}`;
      if (!uniqueIndicatorsMap.has(key)) {
        uniqueIndicatorsMap.set(key, item);
      }
    }
    
    // Get current threat records to check staleness
    const threatRecords = await threatsCollection.find({}).toArray();
    const threatMap = new Map();
    for (const threat of threatRecords) {
      const key = `${threat.indicator}:${threat.type}`;
      threatMap.set(key, threat);
    }
    
    // Build list of indicators to process with their staleness info
    const indicatorsToProcess = [];
    for (const [key, indicator] of uniqueIndicatorsMap.entries()) {
      const threat = threatMap.get(key);
      const isStale = !threat || isIndicatorStale(threat.last_seen, threat.severity);
      
      if (isStale) {
        indicatorsToProcess.push({
          ...indicator,
          severity: threat?.severity || 'low', // Use existing severity or default to low
          lastSeen: threat?.last_seen || null
        });
      }
    }
    
    // Prioritize by severity (high first)
    const prioritizedIndicators = getProcessingOrder(indicatorsToProcess);
    
    console.log(`[${new Date().toISOString()}] Found ${prioritizedIndicators.length} stale indicators to process (out of ${uniqueIndicatorsMap.size} total)`);
    
    // Process each indicator
    for (const { indicator, type, severity, lastSeen } of prioritizedIndicators) {
      try {
        // Enrich the indicator using all sources
        const result = await enrichIndicator({ indicator, type });
        
        // Update or insert threat record
        await threatsCollection.updateOne(
          { indicator, type },
          {
            $set: {
              indicator,
              type,
              issue: result.sources.length > 0 ? 
                `Threat intelligence from ${result.sources.map(s => s.name).join(', ')}` : 
                'No threat intelligence found',
              severity: result.overall_score >= 80 ? 'high' : 
                       result.overall_score >= 50 ? 'medium' : 'low',
              confidence: result.overall_score,
              sources: result.sources,
              last_seen: new Date(),
              updated_at: new Date()
            },
            $setOnInsert: {
              first_seen: new Date(),
              created_at: new Date()
            }
          },
          { upsert: true }
        );
        
        const ageInfo = lastSeen ? ` (was ${Math.floor((Date.now() - new Date(lastSeen).getTime()) / 60000)} min old)` : ' (new)';
        console.log(`✓ Processed ${type}:${indicator} (score: ${result.overall_score})${ageInfo}`);
      } catch (error) {
        console.error(`✗ Failed to process ${type}:${indicator}:`, error.message);
      }
    }
    
    console.log(`[${new Date().toISOString()}] Threat intelligence refresh completed.`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in threat intelligence refresh:`, error);
  }
}

/**
 * Start the background scheduler
 */
function startScheduler() {
  // Run every 10 minutes (can be configured via environment variable)
  const schedule = process.env.BACKGROUND_SCHEDULE || '*/10 * * * *';
  
  console.log(`Starting background scheduler with schedule: ${schedule}`);
  
  // Schedule the job
  const job = cron.schedule(schedule, refreshThreatIntelligence, {
    timezone: 'UTC'
  });
  
  // Run immediately on startup
  refreshThreatIntelligence().catch(console.error);
  
  return job;
}

export { startScheduler, refreshThreatIntelligence };