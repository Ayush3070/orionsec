#!/bin/bash
echo "=== OrionSec System Test ==="
echo ""

echo "1. Testing Backend API (port 8000)..."
curl -s http://localhost:8000/ | jq -c '{service, version, status}'
echo ""

echo "2. Testing Health Check..."
curl -s http://localhost:8000/api/health | jq -c '.status'
echo ""

echo "3. Testing Intel Backend (port 8080)..."
curl -s http://localhost:8080/health | jq -c '{ok, timestamp}'
echo ""

echo "4. Testing Frontend (port 5173)..."
curl -s -o /dev/null -w "Frontend HTTP Status: %{http_code}\n" http://localhost:5173/
echo ""

echo "5. Testing API Proxy (Frontend -> Backend)..."
curl -s http://localhost:5173/api/health | jq -c '.status'
echo ""

echo "6. Testing Log Scan..."
curl -s -X POST http://localhost:5173/api/scan/logs \
  -H "Content-Type: application/json" \
  -d '{"logs": "failed login from 192.168.1.100\nSQL injection attempt\nunauthorized access"}' | jq -c '{threat_count: .summary.threat_count, insights: .insights}'
echo ""

echo "7. Testing Threat Intel..."
curl -s -X POST http://localhost:5173/intel/scan \
  -H "Content-Type: application/json" \
  -d '{"indicator": "8.8.8.8"}' | jq -c '{indicator, overall_score, sources: [.sources[] | .name]}' 2>/dev/null || echo "Intel check skipped (no API key)"
echo ""

echo "=== Test Complete ==="
