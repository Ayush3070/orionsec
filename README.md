# 🛡️ OrionSec - AI-Powered Security Threat Detection Platform

<div align="center">

![OrionSec Banner](https://img.shields.io/badge/OrionSec-Security%20Platform-cyan?style=for-the-badge&logo=shield&logoColor=white)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Build](https://img.shields.io/github/actions/workflow/status/anomalyco/OrionSec/ci.yml?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)

**🔥 Detect threats in seconds. Protect your infrastructure. Sleep better at night. 🔥**

[🚀 Quick Start](#-quick-start) • [✨ Features](#-features) • [📊 Use Cases](#-use-cases) • [🎯 Why OrionSec](#-why-orionsec) • [📖 Documentation](#-documentation)

</div>

---

## 🎯 Why OrionSec?

In a world where **cyber attacks happen every 39 seconds**, traditional security tools are too slow, too expensive, or too complex. **OrionSec changes that.**

### 💡 What Makes OrionSec Special?

<table>
<tr>
<td width="50%">

**🚀 Instant Detection**
- Scan logs, files, or code in milliseconds
- 10+ built-in detection rules
- Real-time threat intelligence enrichment

</td>
<td width="50%">

**🧠 Smart Analysis**
- Pattern recognition for known attack vectors
- Automated severity scoring
- Actionable insights & recommendations

</td>
</tr>
<tr>
<td width="50%">

**📂 Universal Compatibility**
- Works with ANY log format
- Import Kaggle datasets (UNSW-NB15, CICIDS2017)
- Scan source code for vulnerabilities

</td>
<td width="50%">

**🎨 Beautiful Interface**
- Cyberpunk-themed dark/light modes
- Interactive charts & visualizations
- Responsive design for all devices

</td>
</tr>
</table>

---

## ✨ Features

### 🔍 **Multi-Modal Threat Detection**
- **Log Analysis**: Paste logs or upload files → instant threat detection
- **Code Scanning**: Detect vulnerabilities like `eval()`, SQL injection, hardcoded secrets
- **Network Monitoring**: Analyze network traffic logs for suspicious patterns
- **File Upload**: Batch process multiple files simultaneously

### 🧠 **AI-Enhanced Intelligence**
- **AbuseIPDB Integration**: Check IPs against 10,000+ reports
- **OTX AlienVault**: Leverage 100+ threat feeds
- **Automated Enrichment**: Get context on every threat indicator
- **Background Workers**: Continuously update threat intelligence

### 📊 **Beautiful Dashboard**
- **Summary Cards**: High/Medium/Low threat counts at a glance
- **Interactive Charts**: Visualize threat distribution by type, severity, timeline
- **Grouped Views**: Organize threats by type, IP, or file
- **Detailed Tables**: Sort, filter, and drill down into threats

### 🛠️ **Developer-Friendly**
- **REST API**: Full OpenAPI documentation at `/api/docs`
- **JWT Authentication**: Secure access with token-based auth
- **Rate Limiting**: 60 requests/minute protection
- **Docker Ready**: One-command deployment
- **CSV Converter**: Transform any Kaggle dataset into OrionSec format

---

## 📊 Use Cases

### 🏢 **For Security Teams**
```
✅ Monitor SIEM logs in real-time
✅ Investigate security incidents faster
✅ Automate threat hunting workflows
✅ Generate compliance reports
✅ Correlate threats across sources
```

### 👨‍💻 **For Developers**
```
✅ Scan code for security vulnerabilities
✅ Detect hardcoded API keys & secrets
✅ Find SQL injection & XSS risks
✅ Identify weak cryptography usage
✅ CI/CD integration ready
```

### 🎓 **For Researchers**
```
✅ Analyze Kaggle cybersecurity datasets
✅ Convert UNSW-NB15, CICIDS2017 to actionable logs
✅ Benchmark detection algorithms
✅ Visualize attack patterns
✅ Export threat data for analysis
```

### 🏭 **For Enterprises**
```
✅ Centralize threat detection across departments
✅ Reduce mean time to detection (MTTD)
✅ Integrate with existing security stack
✅ Scale with Docker & Kubernetes
✅ Open-source = No vendor lock-in
```

---

## 🚀 Quick Start

### Option 1: Docker (Recommended - 30 seconds)

```bash
# Clone the repository
git clone https://github.com/yourusername/OrionSec.git
cd OrionSec

# Start all services (backend, frontend, intel, MongoDB, Redis)
docker-compose up -d

# Access the platform
open http://localhost:5173
```

**That's it!** 🎉 The platform is now running with:

- 🌐 Frontend: http://localhost:5173
- 🔌 Backend API: http://localhost:8000/api/docs
- 🧠 Intel Service: http://localhost:8080

---

### 🌍 Live Demo

**Try it now:** [https://forty-foes-bet.loca.lt](https://forty-foes-bet.loca.lt)

> **Note:** This is a temporary demo link. For permanent hosting, see [Deployment Options](#-deployment-options).

---

### Option 2: Manual Setup (For Developers)

<details>
<summary>Click to expand step-by-step instructions</summary>

#### Prerequisites
- Python 3.11+
- Node.js 20+
- MongoDB 6.0+
- Redis 7.0+

#### 1. Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env  # Add your API keys
uvicorn app.main:app --reload --port 8000
```

#### 2. Intel Backend (Node.js)
```bash
cd intel-backend
npm install
cp .env.example .env
node server.js
```

#### 3. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

#### 4. Access
Open http://localhost:5173 in your browser.

</details>

---

## 🎮 How to Use OrionSec

### 📝 **Scanning Logs** (Most Common)

1. **Open the Dashboard** → Click "Scan" in sidebar
2. **Choose Mode**: "Logs" (default) or "Code"
3. **Upload Files** or **Paste Logs** directly
4. **Click "Scan Now"** → Watch real-time analysis
5. **Review Results**:
   - Summary cards show threat counts
   - Table view lists all detected threats
   - Grouped view organizes by type/IP
   - Charts visualize patterns
   - Insights panel gives recommendations

**Example Log to Try:**
```
failed login attempt from 192.168.1.100
Unauthorized access detected from 10.0.0.5
SQL injection attempt: SELECT * FROM users WHERE id = 1; DROP TABLE users;
```

---

### 💻 **Scanning Code for Vulnerabilities**

1. **Switch to "Code" Mode** (toggle in scan panel)
2. **Upload Code Files** (.js, .py, .java, etc.)
3. **Click "Scan Now"**
4. **Detect Issues Like**:
   - ❌ `eval()` usage (Code injection)
   - ❌ Hardcoded `API_KEY`, `password`, `secret`
   - ❌ SQL injection vulnerabilities
   - ❌ XSS risks (`innerHTML`, `dangerouslySetInnerHTML`)
   - ❌ Weak cryptography (`MD5`, `SHA1`)
   - ❌ Command execution (`exec()`, `child_process`)

**Example Vulnerable Code:**
```javascript
const apiKey = "sk-1234567890abcdef";  // 🚨 Exposed secret
eval(userInput);                        // 🚨 Code injection
const query = "SELECT * FROM users WHERE id = " + userId;  // 🚨 SQL injection
```

---

### 📂 **Importing Kaggle Datasets**

OrionSec includes **universal CSV converters** that work with ANY dataset structure:

```bash
# Convert UNSW-NB15 dataset (49 columns, no headers)
python3 scripts/universal_csv_to_logs.py \
  -i data/UNSW-NB15_1.csv \
  -o data/converted_logs.txt \
  --no-headers

# Convert CICIDS2017 dataset
python3 scripts/universal_csv_to_logs.py \
  -i data/Monday-WorkingHours.pcap_ISCX.csv \
  -o data/cicids_logs.txt

# Convert ANY CSV (auto-detects structure)
python3 scripts/universal_csv_to_logs.py \
  -i your_dataset.csv \
  -o data/imported_logs.txt
```

Then upload `converted_logs.txt` to OrionSec → **Scan Now** → See threats!

---

## 🎯 Detection Capabilities

| Threat Type | Detection Method | Example |
|------------|------------------|---------|
| 🔐 **Failed Logins** | Pattern matching | `failed login from 192.168.1.100` |
| 💉 **SQL Injection** | Regex + heuristics | `SELECT * FROM users; DROP TABLE` |
| 🔓 **Unauthorized Access** | Rule-based | `Unauthorized access detected` |
| 🤖 **Brute Force** | Frequency analysis | Multiple failed attempts from same IP |
| 🌐 **Port Scanning** | Pattern recognition | `Port scan detected on 192.168.1.1` |
| 🦠 **Malware** | Signature matching | `Malware detected: Trojan.Generic` |
| 💣 **DDoS** | Threshold detection | `DoS attack from multiple sources` |
| 🔑 **Exposed Secrets** | Code scanning | `API_KEY=sk-1234`, `password=123` |
| ⚡ **Code Injection** | Static analysis | `eval()`, `exec()`, `system()` |
| 📜 **XSS Vulnerabilities** | Pattern matching | `innerHTML`, `document.write()` |

---

## 🏗️ Architecture

```
OrionSec/
├── 🎨 frontend/          # React + TailwindCSS + Vite
│   ├── src/
│   │   ├── components/   # UI components (Charts, Tables, etc.)
│   │   ├── utils/        # Code scanner, insights engine
│   │   └── services/     # API client
│   └── dist/             # Production build
│
├── 🔌 backend/           # FastAPI + MongoDB + Redis
│   ├── app/
│   │   ├── api/          # REST endpoints
│   │   ├── services/     # Detection, enrichment, rules
│   │   ├── workers/      # Background jobs
│   │   └── models/       # Data models
│   └── requirements.txt
│
├── 🧠 intel-backend/     # Node.js + Express
│   ├── routes/           # Intel API
│   └── services/         # AbuseIPDB, OTX integration
│
├── 📂 scripts/           # CSV converters & tools
│   ├── universal_csv_to_logs.py  # Works with ANY CSV
│   └── csv_to_orion_logs.py      # Kaggle-specific
│
├── 📊 data/              # Sample logs & test files
└── 🐳 docker-compose.yml # One-command deployment
```

---

## 🔧 API Usage Examples

### Authentication
```bash
# Login to get JWT token
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Use token in subsequent requests
export TOKEN="your_jwt_token_here"
```

### Scan Logs
```bash
# Scan pasted logs
curl -X POST http://localhost:8000/api/scan/logs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"logs": "failed login from 192.168.1.100"}'

# Upload files for scanning
curl -X POST http://localhost:8000/api/scan/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "files=@/path/to/logs.txt"
```

### Get Threats
```bash
# List all threats
curl -X GET "http://localhost:8000/api/threats" \
  -H "Authorization: Bearer $TOKEN"

# Filter by severity
curl -X GET "http://localhost:8000/api/threats?severity=high" \
  -H "Authorization: Bearer $TOKEN"
```

### Enrich Indicators
```bash
# Check IP reputation
curl -X POST http://localhost:8080/intel/scan \
  -H "Content-Type: application/json" \
  -d '{"indicator": "185.220.101.6", "type": "ip"}'
```

**Full API Documentation**: http://localhost:8000/api/docs (Swagger UI)

---

## 🧪 Testing & Verification

```bash
# Run all tests (backend, frontend, intel)
chmod +x test_all.sh
./test_all.sh

# Test specific components
curl http://localhost:8000/health       # Backend health
curl http://localhost:8080/health       # Intel health
curl http://localhost:5173              # Frontend accessible

# Test threat detection
curl -X POST http://localhost:8000/api/scan/logs \
  -H "Content-Type: application/json" \
  -d '{"logs": "failed login from 192.168.1.100"}'
```

---

## 🔒 Security Features

- ✅ **JWT Authentication** - Secure token-based access
- ✅ **Rate Limiting** - 60 requests/minute protection
- ✅ **CORS Protection** - Controlled cross-origin requests
- ✅ **Input Validation** - Prevent injection attacks
- ✅ **Secure Headers** - XSS, clickjacking protection
- ✅ **Environment Isolation** - Secrets in .env files
- ✅ **Log Sanitization** - No sensitive data in logs

---

## 📈 Roadmap

- [ ] **Machine Learning Integration** - Train custom detection models
- [ ] **SIEM Integration** - Export to Splunk, ELK, QRadar
- [ ] **Alert System** - Email/Slack notifications for critical threats
- [ ] **Multi-tenant Support** - Teams, roles, permissions
- [ ] **Threat Hunting** - Advanced query language
- [ ] **Mobile App** - iOS/Android dashboard
- [ ] **Kubernetes Helm Chart** - Cloud-native deployment

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 💬 Community & Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/OrionSec/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/yourusername/OrionSec/discussions)
- 📧 **Email**: support@orionsec.io
- 💬 **Discord**: [Join our community](https://discord.gg/orionsec)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**Free for:**
- ✅ Personal projects
- ✅ Commercial use
- ✅ Modification & distribution
- ✅ Private use

---

## ⭐ Show Your Support

If OrionSec helps you, please **⭐ star this repository**! It helps others discover the project.

---

## 🏆 Acknowledgments

- **AbuseIPDB** - IP reputation data
- **OTX AlienVault** - Threat intelligence feeds
- **UNSW-NB15 Dataset** - Training & testing
- **CICIDS2017 Dataset** - Benchmarking
- **All Contributors** - Thank you for your contributions!

---

<div align="center">

### 🚀 **Ready to Secure Your Infrastructure?**

[![Get Started](https://img.shields.io/badge/Get%20Started-Now!-cyan?style=for-the-badge&logo=rocket)](https://github.com/yourusername/OrionSec)
[![Documentation](https://img.shields.io/badge/Read-Docs-blue?style=for-the-badge&logo=gitbook)](https://github.com/yourusername/OrionSec/wiki)
[![Demo](https://img.shields.io/badge/Watch-Demo-red?style=for-the-badge&logo=youtube)](https://youtube.com/orionsec)

**Built with ❤️ by Ayush Mishra**

*Securing the digital world, one threat at a time.* 🛡️

</div>
