#!/usr/bin/env python3
"""
OrionSec (Sandbox CLI)

Hardcoded sample "files/logs" scanned with simple pattern matching.
No external dependencies. Not production.
"""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from typing import Iterable


@dataclass(frozen=True)
class Threat:
    file: str
    issue: str
    severity: str  # "low" | "medium" | "high"
    line: int

    def as_dict(self) -> dict:
        return {"file": self.file, "issue": self.issue, "severity": self.severity, "line": self.line}

@dataclass
class FindingGroup:
    file: str
    issue: str
    severity: str
    count: int
    lines: list[int]

    def as_dict(self) -> dict:
        return {
            "file": self.file,
            "issue": self.issue,
            "severity": self.severity,
            "count": self.count,
            "lines": self.lines,
        }


HARD_CODED_INPUTS: dict[str, str] = {
    "src/app.js": """\
// Example JavaScript file with obvious issues
const API_KEY = "EXAMPLE_TOKEN_1234567890abcdefghijklmnopqrstuvwxyzABCDE";

function run(userInput) {
  // Dangerous: executes user input
  return eval(userInput);
}

const password = "hunter2";
console.log("ok");
""",
    "src/admin.js": """\
// Admin helper with multiple smells
const password = "supersecret";
const API_KEY = "EXAMPLE_TOKEN_abcdefghijklmnopqrstuvwxyz0123456789ABCDE";

export function unsafeRender(template) {
  return eval(template);
}
""",
    "src/payments.js": """\
// Payments logic (sandbox)
const API_KEY = "EXAMPLE_TOKEN_payments_abcdefghijklmnopqrstuvwxyz0123456789"; // token-like string

export function compute(expr) {
  return eval(expr);
}
""",
    "config/.env.example": """\
# Example env file accidentally committed
API_KEY = "EXAMPLE_TOKEN_zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"
password = "letmein"
SESSION_TOKEN = "EXAMPLE_SESSION_TOKEN_1234567890ABCDEF1234567890ABCDEF12345678"
""",
    "logs/auth.log": """\
2026-04-30T12:10:00Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:10:03Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:10:07Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:10:10Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:10:13Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:10:16Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:10:19Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:10:22Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:10:25Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:10:28Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:10:31Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:10:34Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:10:37Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:10:40Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:10:43Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:10:46Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:10:49Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:10:52Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:10:55Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:10:58Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:11:01Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:11:04Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:11:07Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:11:10Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:11:13Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:11:16Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:11:19Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:11:22Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:11:25Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:11:28Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:11:31Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:11:34Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:11:37Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:11:40Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:11:43Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:11:46Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:11:49Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:11:52Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:11:55Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:11:58Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:12:01Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:12:04Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:12:07Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:12:10Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:12:13Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:12:16Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:12:19Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:12:22Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:12:25Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:12:28Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:12:31Z INFO user=jane action=login status=failed login ip=203.0.113.9
2026-04-30T12:11:12Z WARN suspicious IP detected ip=198.51.100.23
""",
}


def scanFile(filename: str, content: str) -> list[Threat]:
    lines = content.splitlines()
    return detectThreats(filename, lines)


def detectThreats(filename: str, lines: Iterable[str]) -> list[Threat]:
    threats: list[Threat] = []

    eval_pattern = re.compile(r"\beval\s*\(")
    api_key_assignment = re.compile(r"\bAPI_KEY\s*=")
    password_assignment = re.compile(r"\bpassword\s*=", re.IGNORECASE)
    failed_login = re.compile(r"\bfailed login\b", re.IGNORECASE)
    long_token = re.compile(r"""(?x)
        (?:
            sk_(?:live|test)_[A-Za-z0-9]{16,}  # common "sk_*" shape
            |
            [A-Za-z0-9_\-]{32,}                # long tokens / opaque IDs
            |
            [A-Fa-f0-9]{32,}                   # long hex strings
        )
    """)

    for idx, line in enumerate(lines, start=1):
        if eval_pattern.search(line):
            threats.append(
                Threat(
                    file=filename,
                    issue="Use of eval() (code execution risk)",
                    severity="high",
                    line=idx,
                )
            )

        if api_key_assignment.search(line) or long_token.search(line):
            threats.append(
                Threat(
                    file=filename,
                    issue="Possible hardcoded API key / token",
                    severity="high",
                    line=idx,
                )
            )

        if password_assignment.search(line):
            threats.append(
                Threat(
                    file=filename,
                    issue="Possible hardcoded password assignment",
                    severity="medium",
                    line=idx,
                )
            )

        if failed_login.search(line):
            threats.append(
                Threat(
                    file=filename,
                    issue='Repeated "failed login" event',
                    severity="low",
                    line=idx,
                )
            )

    return threats


def generateReport(threats: list[Threat], *, as_json: bool) -> str:
    report = aggregateThreats(threats)

    if as_json:
        return json.dumps(report, indent=2)

    return formatHumanReport(report)


def aggregateThreats(threats: list[Threat]) -> dict:
    grouped: dict[tuple[str, str, str], FindingGroup] = {}
    for t in threats:
        key = (t.file, t.issue, t.severity)
        group = grouped.get(key)
        if group is None:
            grouped[key] = FindingGroup(file=t.file, issue=t.issue, severity=t.severity, count=1, lines=[t.line])
        else:
            group.count += 1
            group.lines.append(t.line)

    files: dict[str, list[FindingGroup]] = {}
    severity_summary = {"high": 0, "medium": 0, "low": 0}

    for group in grouped.values():
        group.lines = sorted(set(group.lines))
        files.setdefault(group.file, []).append(group)
        severity_summary[group.severity] = severity_summary.get(group.severity, 0) + group.count

    severity_order = {"high": 0, "medium": 1, "low": 2}
    for filename in list(files.keys()):
        files[filename].sort(key=lambda g: (severity_order.get(g.severity, 99), g.lines[0] if g.lines else 10**9, g.issue))

    insights = buildInsights(files)

    return {
        "tool": "OrionSec Sandbox CLI",
        "summary": severity_summary,
        "insights": insights,
        "files": {name: [g.as_dict() for g in groups] for name, groups in sorted(files.items())},
    }


def buildInsights(files: dict[str, list[FindingGroup]]) -> list[str]:
    insights: list[str] = []

    failed_login_total = 0
    api_key_total = 0
    per_file_api_keys: dict[str, int] = {}

    for filename, groups in files.items():
        for g in groups:
            if g.issue == 'Repeated "failed login" event':
                failed_login_total += g.count
            if g.issue == "Possible hardcoded API key / token":
                api_key_total += g.count
                per_file_api_keys[filename] = per_file_api_keys.get(filename, 0) + g.count

    if failed_login_total > 10:
        insights.append(f"Possible brute force attack: {failed_login_total} failed login events detected.")

    high_risk_files = [f for f, c in sorted(per_file_api_keys.items()) if c > 1]
    if high_risk_files:
        insights.append("Sensitive data exposure risk: multiple API keys/tokens detected in " + ", ".join(high_risk_files) + ".")
    elif api_key_total > 1:
        insights.append(f"Sensitive data exposure risk: {api_key_total} API key/token-like strings detected.")

    return insights


def formatHumanReport(report: dict) -> str:
    summary = report.get("summary") or {}
    insights = report.get("insights") or []
    files = report.get("files") or {}

    def fmt_sev(sev: str) -> str:
        return sev.upper()

    def sev_symbol(sev: str) -> str:
        if sev == "high":
            return "!!!"
        if sev == "medium":
            return "!!"
        return "!"

    def fmt_lines(lines: list[int]) -> str:
        if not lines:
            return "n/a"
        if len(lines) == 1:
            return str(lines[0])
        if len(lines) <= 6:
            return ", ".join(str(n) for n in lines)
        return f"{lines[0]}–{lines[-1]}"

    out: list[str] = []
    out.append("OrionSec Security Report (Sandbox)")
    out.append("=" * 34)
    out.append("")
    out.append("Severity Summary")
    out.append(f"- High:   {summary.get('high', 0)}")
    out.append(f"- Medium: {summary.get('medium', 0)}")
    out.append(f"- Low:    {summary.get('low', 0)}")

    if insights:
        out.append("")
        out.append("Insights")
        for insight in insights:
            out.append(f"- {insight}")

    out.append("")
    out.append("Findings")

    for filename, groups in files.items():
        out.append(f"\nFile: {filename}")
        for g in groups:
            count = int(g.get("count", 1) or 1)
            if count > 1:
                out.append(
                    f"  - [{fmt_sev(g['severity'])}] {sev_symbol(g['severity'])} {g['issue']} (occurrences: {count})"
                )
            else:
                out.append(
                    f"  - [{fmt_sev(g['severity'])}] {sev_symbol(g['severity'])} {g['issue']} (line: {fmt_lines(g.get('lines') or [])})"
                )

    return "\n".join(out)


def main() -> int:
    parser = argparse.ArgumentParser(description="OrionSec sandbox threat scanner (hardcoded inputs).")
    parser.add_argument("--json", action="store_true", help="Output JSON array instead of line-by-line objects.")
    args = parser.parse_args()

    all_threats: list[Threat] = []
    for filename, content in HARD_CODED_INPUTS.items():
        all_threats.extend(scanFile(filename, content))

    print(generateReport(all_threats, as_json=bool(args.json)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
