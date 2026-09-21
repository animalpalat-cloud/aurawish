// api/analytics.js
// ─────────────────────────────────────────────────────────────────────────────
// Vercel Serverless Function — GA4 Real-time Analytics Proxy
//
// Endpoints:
//   GET /api/analytics?type=realtime   → active users right now
//
// Environment Variables Required (set in Vercel project settings):
//   GA4_SERVICE_ACCOUNT_JSON   — full JSON content of your service-account key
//   GA4_PROPERTY_ID            — your GA4 numeric property ID (e.g. "123456789")
//
// The service account JSON key must NEVER be exposed to the browser.
// ─────────────────────────────────────────────────────────────────────────────

// ── Google OAuth2 Token Helper ─────────────────────────────────────────────
// Implements the JWT Bearer flow for Google service accounts using only the
// Node.js built-in `crypto` module — no extra npm packages required.

function base64UrlEncode(buffer) {
  return Buffer.from(buffer)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function getGoogleAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64UrlEncode(
    JSON.stringify({
      iss: serviceAccount.client_email,
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    })
  );

  const signingInput = `${header}.${payload}`;

  // Use Node.js crypto to sign with RS256
  const crypto = await import('crypto');
  const privateKey = (serviceAccount.private_key || '').replace(/\\n/g, '\n');
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signingInput);
  const signature = base64UrlEncode(sign.sign(privateKey));

  const jwt = `${signingInput}.${signature}`;

  // Exchange JWT for an access token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    throw new Error(`Failed to get Google access token: ${err}`);
  }

  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}

// ── Main Handler ───────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Helper to resolve env vars locally or on server ──────────────────────
  let propertyId = process.env.GA4_PROPERTY_ID;
  let serviceAccountJson = process.env.GA4_SERVICE_ACCOUNT_JSON;

  // If running locally with Node/Vite without process.env populated, check .env
  if (!propertyId || (!serviceAccountJson && !process.env.GA4_SERVICE_ACCOUNT_PATH)) {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const envPath = path.resolve(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        for (const line of envContent.split('\n')) {
          const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
          if (match) {
            const key = match[1];
            let value = (match[2] || '').trim();
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
            if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
            if (!propertyId && key === 'GA4_PROPERTY_ID') propertyId = value;
            if (!serviceAccountJson && key === 'GA4_SERVICE_ACCOUNT_JSON') serviceAccountJson = value;
            if (!process.env.GA4_SERVICE_ACCOUNT_PATH && key === 'GA4_SERVICE_ACCOUNT_PATH') {
              process.env.GA4_SERVICE_ACCOUNT_PATH = value;
            }
          }
        }
      }
    } catch {}
  }

  // Also support reading from a local JSON key file if GA4_SERVICE_ACCOUNT_PATH is given
  if (!serviceAccountJson && process.env.GA4_SERVICE_ACCOUNT_PATH) {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const keyPath = path.resolve(process.cwd(), process.env.GA4_SERVICE_ACCOUNT_PATH);
      if (fs.existsSync(keyPath)) {
        serviceAccountJson = fs.readFileSync(keyPath, 'utf8');
      }
    } catch {}
  }

  if (propertyId) {
    propertyId = String(propertyId).replace(/['"]/g, '').trim();
  }

  if (!propertyId) {
    return res.status(500).json({
      error: 'Missing GA4_PROPERTY_ID environment variable.',
    });
  }

  if (!serviceAccountJson) {
    return res.status(500).json({
      error: 'Missing GA4_SERVICE_ACCOUNT_JSON environment variable (or GA4_SERVICE_ACCOUNT_PATH).',
    });
  }

  let serviceAccount;
  try {
    serviceAccount = typeof serviceAccountJson === 'object' ? serviceAccountJson : JSON.parse(serviceAccountJson);
  } catch (err) {
    return res.status(500).json({ error: `GA4_SERVICE_ACCOUNT_JSON is not valid JSON: ${err.message}` });
  }

  try {
    const accessToken = await getGoogleAccessToken(serviceAccount);
    const { type = 'realtime' } = req.query;

    if (type === 'realtime') {
      // ── GA4 Realtime Report ──────────────────────────────────────────────
      const gaRes = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runRealtimeReport`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            metrics: [{ name: 'activeUsers' }],
            dimensions: [{ name: 'unifiedScreenName' }],
          }),
        }
      );

      if (!gaRes.ok) {
        const errText = await gaRes.text();
        let message = errText;
        try {
          const parsed = JSON.parse(errText);
          if (parsed.error?.message) {
            message = parsed.error.message;
          }
        } catch {}
        return res.status(gaRes.status).json({ error: `GA4 API error: ${message}` });
      }

      const data = await gaRes.json();

      // Sum active users and collect per-page breakdown
      let activeUsers = 0;
      let topPages = [];

      if (data.rows && data.rows.length > 0) {
        topPages = data.rows
          .map((row) => ({
            page: row.dimensionValues?.[0]?.value || '(unknown)',
            users: parseInt(row.metricValues?.[0]?.value || '0', 10),
          }))
          .sort((a, b) => b.users - a.users)
          .slice(0, 10);
      }

      // Check totals first, or fallback to sum of top pages
      if (data.totals?.[0]?.metricValues?.[0]?.value) {
        activeUsers = parseInt(data.totals[0].metricValues[0].value, 10) || 0;
      } else if (topPages.length > 0) {
        activeUsers = topPages.reduce((sum, p) => sum + p.users, 0);
      }

      // Cache for 25s (just under the 30s client refresh interval)
      res.setHeader('Cache-Control', 's-maxage=25, stale-while-revalidate=5');

      return res.status(200).json({
        activeUsers,
        topPages,
        fetchedAt: new Date().toISOString(),
      });
    }

    return res.status(400).json({ error: `Unknown type: ${type}` });
  } catch (err) {
    console.error('[analytics api]', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
