# ⚡ Deploy OrionSec for FREE (No Credit Card)

## 🎯 The Problem with Local MongoDB
Render free tier = 1 web service only. Can't host MongoDB separately.

## ✅ Solution: MongoDB Atlas M0 (100% Free Forever)

### Step 1: Sign Up (30 seconds)
1. Open: https://www.mongodb.com/cloud/atlas/register
2. Sign up with **Google** (fastest)
3. Choose **Shared** → **M0 Free** tier
4. Region: Pick closest to you

### Step 2: Create Database User
- **Database Access** → **Add New Database User**
  - Username: `orionsec`
  - Password: Click **Autogenerate** → **Copy it!**

### Step 3: Allow All IPs
- **Network Access** → **Add IP Address** → **0.0.0.0/0** (allow from anywhere)

### Step 4: Get Connection String
- **Databases** → **Connect** → **Drivers** → Copy this:
  ```
  mongodb+srv://orionsec:<password>@cluster.mongodb.net/orionsec?retryWrites=true&w=majority
  ```
- Replace `<password>` with your actual password

---

## 🚀 Deploy to Render (5 minutes)

### Step 1: Push to GitHub (Done ✅)
Repo: https://github.com/Ayush3070/orionsec

### Step 2: Create Render Account
1. Open: https://dashboard.render.com
2. **Sign Up** with **GitHub** (free)

### Step 3: Deploy Backend + Frontend
1. Click **New +** → **Blueprint**
2. Connect: `Ayush3070/orionsec`
3. Render detects `render.yaml` automatically

### Step 4: Set Environment Variables
After creating services, go to each → **Environment**:

**orionsec service:**
| Key | Value |
|-----|-------|
| `MONGO_URL` | Your Atlas connection string |
| `SECRET_KEY` | Run: `openssl rand -hex 32` |
| `CORS_ORIGINS` | `https://orionsec.onrender.com` |

**orionsec-intel service:**
| Key | Value |
|-----|-------|
| `MONGO_URL` | Same Atlas string |
| `CORS_ORIGIN` | `https://orionsec.onrender.com` |

### Step 5: Deploy!
Click **Deploy** → Wait ~5 minutes → Done! 🎉

---

## 🌍 Your App URLs

- **Frontend + API**: https://orionsec.onrender.com
- **API Docs**: https://orionsec.onrender.com/api/docs
- **Intel**: https://orionsec-intel.onrender.com

---

## 💰 Cost Breakdown

| Service | Cost |
|---------|------|
| Render (1 web service) | **$0** (750 hrs/month free) |
| MongoDB Atlas M0 | **$0** (forever free) |
| **Total** | **$0** |

> **Note**: 750 hrs = ~31 days. You can run 1 service 24/7 free!

---

## 🆘 Stuck?

1. **MongoDB connection fails?**
   - Check Atlas IP whitelist = `0.0.0.0/0`
   - Verify password in connection string

2. **Build fails?**
   - Check Python version = `3.12.4`
   - Check Node version = `20`

3. **CORS errors?**
   - Set `CORS_ORIGINS` exactly: `https://orionsec.onrender.com`

---

## ✅ Done!

Your OrionSec app is live 24/7 for **$0**!

Share this link: **https://orionsec.onrender.com**
