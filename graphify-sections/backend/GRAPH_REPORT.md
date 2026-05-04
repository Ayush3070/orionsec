# Graph Report - /Users/ayushmishra/Developer/OrionSec/backend  (2026-04-30)

## Corpus Check
- Corpus is ~2,734 words - fits in a single context window. You may not need a graph.

## Summary
- 83 nodes · 92 edges · 6 communities detected
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.74)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]

## God Nodes (most connected - your core abstractions)
1. `RuleEngine` - 9 edges
2. `ThreatModel` - 8 edges
3. `fetch_and_store_all_threats()` - 6 edges
4. `aggregateThreats()` - 5 edges
5. `ThreatFinding` - 4 edges
6. `scan_content_with_rules()` - 4 edges
7. `generateReport()` - 4 edges
8. `fetch_and_store_threats()` - 3 edges
9. `fetch_mock_threats()` - 3 edges
10. `scan_file_content()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `fetch_and_store_threats()` --calls--> `fetch_and_store_all_threats()`  [INFERRED]
  app/main.py → app/services/fetch_services.py
- `fetch_threats()` --calls--> `fetch_and_store_threats()`  [INFERRED]
  app/api/routes/threats.py → app/services/fetch_services.py
- `scan_file_content()` --calls--> `scan_content_with_rules()`  [INFERRED]
  app/services/detection_service.py → app/services/rule_engine.py
- `Scan file content using rule-based engine` --uses--> `ThreatFinding`  [INFERRED]
  app/services/detection_service.py → app/services/rule_engine.py
- `analyze_logs()` --calls--> `detect_threats_from_logs()`  [INFERRED]
  app/api/routes/logs.py → app/services/detection_service.py

## Communities

### Community 0 - "Community 0"
Cohesion: 0.16
Nodes (11): Detect brute force attacks based on failed login attempts, Calculate severity based on total weight and thresholds, Process a file and return threat analysis, Convenience function to scan a file using the rule engine, Convenience function to scan content using the rule engine, Scan content using rule-based engine, Rule, RuleEngine (+3 more)

### Community 1 - "Community 1"
Cohesion: 0.14
Nodes (7): Delete threats older than specified days, Create indexes for efficient querying, Save or update threat information         Args:             threat_data: dict wi, Get a specific threat by indicator and type, Get threats with optional filtering         Args:             filters: dict with, Get historical data for a specific threat, ThreatModel

### Community 2 - "Community 2"
Cohesion: 0.3
Nodes (9): aggregateThreats(), buildInsights(), detectThreats(), FindingGroup, formatHumanReport(), generateReport(), main(), scanFile() (+1 more)

### Community 3 - "Community 3"
Cohesion: 0.22
Nodes (6): BaseModel, analyze_logs(), LogInput, detect_threats_from_logs(), Scan file content using rule-based engine, scan_file_content()

### Community 4 - "Community 4"
Cohesion: 0.31
Nodes (7): fetch_and_store_threats(), fetch_and_store_all_threats(), fetch_and_store_threats(), fetch_mock_threats(), fetch_otx(), Fetch threats from all sources, Mock threat fetching function for demonstration

### Community 5 - "Community 5"
Cohesion: 0.33
Nodes (5): fetch_threats(), get_threat_history(), get_threats(), Get threats with optional filtering, Get historical data for a specific indicator

## Knowledge Gaps
- **16 isolated node(s):** `Create indexes for efficient querying`, `Save or update threat information         Args:             threat_data: dict wi`, `Get a specific threat by indicator and type`, `Get threats with optional filtering         Args:             filters: dict with`, `Get historical data for a specific threat` (+11 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `scan_content_with_rules()` connect `Community 0` to `Community 3`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `scan_file_content()` connect `Community 3` to `Community 0`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `Create indexes for efficient querying`, `Save or update threat information         Args:             threat_data: dict wi`, `Get a specific threat by indicator and type` to the rest of the system?**
  _16 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._