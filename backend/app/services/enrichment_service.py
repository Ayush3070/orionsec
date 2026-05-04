import httpx
from typing import Dict, Optional
from app.core.config import settings

async def enrich_indicators(indicators: list) -> Dict[str, dict]:
    results = {}
    async with httpx.AsyncClient(timeout=10.0) as client:
        for indicator in indicators:
            try:
                intel_url = settings.INTEL_BACKEND_URL or "http://localhost:8080"
                response = await client.post(
                    f"{intel_url}/intel/scan",
                    json={"indicator": indicator}
                )
                if response.status_code == 200:
                    results[indicator] = response.json()
            except Exception as e:
                print(f"Failed to enrich {indicator}: {e}")
    return results

async def enrich_single_indicator(indicator: str, indicator_type: str = "ip") -> Optional[dict]:
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            intel_url = settings.INTEL_BACKEND_URL or "http://localhost:8080"
            response = await client.post(
                f"{intel_url}/intel/scan",
                json={"indicator": indicator, "type": indicator_type}
            )
            if response.status_code == 200:
                return response.json()
    except Exception as e:
        print(f"Failed to enrich {indicator}: {e}")
    return None
