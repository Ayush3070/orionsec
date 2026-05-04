# Free Deployment Guide (Render + MongoDB Atlas)

## Step 1: MongoDB Atlas (Free Tier)

1. Sign up: https://www.mongodb.com/cloud/atlas/register
2. Create **Shared** cluster (M0 Free tier)
3. Create database user (remember username/password)
4. **Network Access** → Add IP: `0.0.0.0/0` (allow from anywhere)
5. **Connect** → **Drivers** → Copy connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/orionsec?retryWrites=true&w=majority
   ```

## Step 2: Deploy to Render (Free)

### 2.1 Backend + Frontend

1. Go to: https://dashboard.render.com
2. **New +** → **Blueprint**
3. Connect GitHub repo: `Ayush3070/orionsec`
4. Render will detect `render.yaml` automatically

### 2.2 Intel Backend

1. **New +** → **Web Service**
2. Connect: `Ayush3070/orionsec`
3. **Root Directory**: `intel-backend`
4. **Runtime**: Node.js
5. **Build Command**: `npm install`
6. **Start Command**: `node server.js`
7. Add environment variable:
   - `MONGO_URL`: (your Atlas connection string)
   - `CORS_ORIGIN`: `https://orionsec.onrender.com`

## Step 3: Environment Variables

Set these in Render dashboard:

| Key | Value |
|-----|-------|
| `MONGO_URL` | Your Atlas connection string |
| `SECRET_KEY` | Run: `openssl rand -hex 32` |
| `CORS_ORIGINS` | `https://orionsec.onrender.com` |
| `INTEL_BACKEND_URL` | `https://orionsec-intel.onrender.com` |

## Step 4: Access Your App

- **Frontend**: https://orionsec.onrender.com
- **API Docs**: https://orionsec.onrender.com/api/docs
- **Intel**: https://orionsec-intel.onrender.com

## Free Tier Limits

| Service | Limit |
|---------|-------|
| Render Web | 750 hours/month (enough for 1 service 24/7) |
| MongoDB Atlas M0 | 512MB storage |
| Bandwidth | 100GB/month |

## Troubleshooting

**Build fails?**
- Check Python version: set `PYTHON_VERSION=3.12.4`
- Check Node version: set `NODE_VERSION=20`

**Can't connect to MongoDB?**
- Verify Atlas IP whitelist: `0.0.0.0/0`
- Check connection string format

**CORS errors?**
- Set `CORS_ORIGINS` to your frontend URL
