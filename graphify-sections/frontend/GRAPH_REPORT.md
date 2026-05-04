# Graph Report - /Users/ayushmishra/Developer/OrionSec/frontend  (2026-04-30)

## Corpus Check
- Corpus is ~4,520 words - fits in a single context window. You may not need a graph.

## Summary
- 38 nodes · 25 edges · 3 communities detected
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 4|Community 4]]

## God Nodes (most connected - your core abstractions)
1. `App()` - 2 edges
2. `useTheme()` - 2 edges
3. `humanBytes()` - 2 edges
4. `UploadBox()` - 2 edges
5. `readText()` - 2 edges
6. `scanInputs()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `useTheme()`  [INFERRED]
  src/App.jsx → src/contexts/ThemeContext.jsx

## Communities

### Community 0 - "Community 0"
Cohesion: 0.33
Nodes (2): readText(), scanInputs()

### Community 1 - "Community 1"
Cohesion: 0.33
Nodes (2): useTheme(), App()

### Community 4 - "Community 4"
Cohesion: 1.0
Nodes (2): humanBytes(), UploadBox()

## Knowledge Gaps
- **Thin community `Community 0`** (7 nodes): `getIntelHistory()`, `getThreatHistory()`, `getThreats()`, `postIntelScan()`, `readText()`, `scanInputs()`, `api.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 1`** (6 nodes): `ThemeProvider()`, `useTheme()`, `App()`, `App.jsx`, `severitySortValue()`, `ThemeContext.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 4`** (3 nodes): `humanBytes()`, `UploadBox()`, `UploadBox.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Not enough signal to generate questions. This usually means the corpus has no AMBIGUOUS edges, no bridge nodes, no INFERRED relationships, and all communities are tightly cohesive. Add more files or run with --mode deep to extract richer edges._