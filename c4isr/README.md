# C4ISR-style Flight Aggregation Platform (Safe Edition)

Features implemented:
- OpenSky + ADSB.lol aggregation (backend REST proxy)
- Scalable 2D/3D mapping (MapLibre GL + deck.gl) up to ~50k flights (icons for small sets, WebGL points for large sets)
- Multilingual UI: English, فارسی (fa), Svenska (sv)
- Popups with details, route tracking, filterable icons
- Base layers: Streets (light/dark), High-contrast, Satellite
- Notifications + voice alerts (web) for custom risk rules
- HTTP/3 via Caddy reverse proxy (for supported clients)

Explicitly NOT included (legal/ethical constraints):
- GPS jamming/spoofing; any interference features are prohibited
- Unauthorized scraping of commercial services; use official APIs
- Real-time military deconfliction or targeting

## Quick start

### Backend
```
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
```

### Frontend
```
cd frontend
npm i
npm run dev -- --host
```

Open: http://localhost:5173

### Reverse proxy (HTTP/3 with Caddy via Docker)
```
cd deploy
docker compose up -d
```

- Caddy will expose HTTPS on 8443 (self-signed) and HTTP on 8081 (for local dev). HTTP/3 requires HTTPS.
- Frontend will be proxied at https://localhost:8443/ and http://localhost:8081/

## Configuration
- Add API keys (if any) via environment variables; see `backend/.env.example`.
- You can set `OPEN_SKY_USERNAME` and `OPEN_SKY_PASSWORD` for authenticated rate limits.
- See `frontend/src/config.ts` to adjust map styles and thresholds.

## Notes
- This is a research/demonstration platform; validate local laws before use.
- Data sources are third-party and rate limited; use bbox queries and caching.
