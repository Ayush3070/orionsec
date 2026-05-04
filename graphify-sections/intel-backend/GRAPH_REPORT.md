# Graph Report - /Users/ayushmishra/Developer/OrionSec/intel-backend  (2026-04-30)

## Corpus Check
- Corpus is ~2,576 words - fits in a single context window. You may not need a graph.

## Summary
- 32 nodes · 48 edges · 5 communities detected
- Extraction: 69% EXTRACTED · 31% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 5|Community 5]]

## God Nodes (most connected - your core abstractions)
1. `enrichIndicator()` - 9 edges
2. `refreshThreatIntelligence()` - 6 edges
3. `setCachedIntel()` - 6 edges
4. `getCachedIntel()` - 5 edges
5. `clampScore()` - 5 edges
6. `getDb()` - 4 edges
7. `fetchAbuseIPDB()` - 4 edges
8. `fetchOTX()` - 4 edges
9. `fetchMockSource()` - 4 edges
10. `overallFromSources()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `refreshThreatIntelligence()` --calls--> `getDb()`  [INFERRED]
  scheduler.js → db.js
- `refreshThreatIntelligence()` --calls--> `enrichIndicator()`  [INFERRED]
  scheduler.js → services/aggregator.js
- `getCachedIntel()` --calls--> `getDb()`  [INFERRED]
  services/cache.js → db.js
- `setCachedIntel()` --calls--> `getDb()`  [INFERRED]
  services/cache.js → db.js
- `overallFromSources()` --calls--> `clampScore()`  [INFERRED]
  services/aggregator.js → services/normalization.js

## Communities

### Community 0 - "Community 0"
Cohesion: 0.46
Nodes (6): getDb(), cacheKey(), calculateTTLBySeverity(), getCachedIntel(), nowMs(), setCachedIntel()

### Community 1 - "Community 1"
Cohesion: 0.32
Nodes (4): fetchAbuseIPDB(), fetchMockSource(), clampScore(), severityFromConfidence()

### Community 2 - "Community 2"
Cohesion: 0.7
Nodes (4): getProcessingOrder(), isIndicatorStale(), refreshThreatIntelligence(), startScheduler()

### Community 3 - "Community 3"
Cohesion: 0.83
Nodes (3): enrichIndicator(), generateExplanation(), overallFromSources()

### Community 5 - "Community 5"
Cohesion: 1.0
Nodes (2): fetchOTX(), severityFromPulses()

## Knowledge Gaps
- **Thin community `Community 5`** (3 nodes): `fetchOTX()`, `severityFromPulses()`, `otx.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `enrichIndicator()` connect `Community 3` to `Community 0`, `Community 1`, `Community 2`, `Community 5`?**
  _High betweenness centrality (0.492) - this node is a cross-community bridge._
- **Why does `refreshThreatIntelligence()` connect `Community 2` to `Community 0`, `Community 3`?**
  _High betweenness centrality (0.223) - this node is a cross-community bridge._
- **Why does `setCachedIntel()` connect `Community 0` to `Community 3`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `enrichIndicator()` (e.g. with `refreshThreatIntelligence()` and `getCachedIntel()`) actually correct?**
  _`enrichIndicator()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `refreshThreatIntelligence()` (e.g. with `getDb()` and `enrichIndicator()`) actually correct?**
  _`refreshThreatIntelligence()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `setCachedIntel()` (e.g. with `enrichIndicator()` and `getDb()`) actually correct?**
  _`setCachedIntel()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `getCachedIntel()` (e.g. with `enrichIndicator()` and `getDb()`) actually correct?**
  _`getCachedIntel()` has 2 INFERRED edges - model-reasoned connections that need verification._