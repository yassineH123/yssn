const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'love2024';
const BIN_ID  = process.env.JSONBIN_ID;
const API_KEY = process.env.JSONBIN_KEY;
const BASE    = 'https://api.jsonbin.io/v3/b';

async function readDB() {
  const r = await fetch(`${BASE}/${BIN_ID}/latest`, {
    headers: { 'X-Master-Key': API_KEY }
  });
  const j = await r.json();
  return j.record || { photos: [], messages: [] };
}

async function writeDB(data) {
  await fetch(`${BASE}/${BIN_ID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY },
    body: JSON.stringify(data)
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-admin-password');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url      = req.url.replace('/api', '');
  const isAdmin  = req.headers['x-admin-password'] === ADMIN_PASSWORD;

  // GET /data
  if (req.method === 'GET' && url.startsWith('/data')) {
    const db = await readDB();
    return res.json({ photos: db.photos, messages: db.messages });
  }

  // POST /pick-message
  if (req.method === 'POST' && url.startsWith('/pick-message')) {
    const seen = (req.body || {}).seen || [];
    const db   = await readDB();
    let pool   = db.messages.filter(m => !seen.includes(m.id));
    if (!pool.length) pool = [...db.messages];
    if (!pool.length) return res.json({ message: null });
    return res.json({ message: pool[Math.floor(Math.random() * pool.length)] });
  }

  // POST /admin/verify
  if (req.method === 'POST' && url.startsWith('/admin/verify')) {
    const ok = (req.body || {}).password === ADMIN_PASSWORD;
    return res.status(ok ? 200 : 401).json({ ok });
  }

  if (!isAdmin) return res.status(401).json({ error: 'Unauthorized' });

  // POST /admin/photo
  if (req.method === 'POST' && url.startsWith('/admin/photo')) {
    const { name, dataUrl } = req.body || {};
    const db = await readDB();
    const entry = { id: Date.now().toString(), name: name || 'photo', dataUrl };
    db.photos.push(entry);
    await writeDB(db);
    return res.json({ ok: true, photo: entry });
  }

  // DELETE /admin/photo/:id
  if (req.method === 'DELETE' && url.startsWith('/admin/photo/')) {
    const id = url.split('/').pop();
    const db = await readDB();
    db.photos = db.photos.filter(p => p.id !== id);
    await writeDB(db);
    return res.json({ ok: true });
  }

  // POST /admin/message
  if (req.method === 'POST' && url.startsWith('/admin/message')) {
    const text = (req.body || {}).text?.trim();
    if (!text) return res.status(400).json({ error: 'empty' });
    const db = await readDB();
    const entry = { id: Date.now().toString(), text };
    db.messages.push(entry);
    await writeDB(db);
    return res.json({ ok: true, message: entry });
  }

  // DELETE /admin/message/:id
  if (req.method === 'DELETE' && url.startsWith('/admin/message/')) {
    const id = url.split('/').pop();
    const db = await readDB();
    db.messages = db.messages.filter(m => m.id !== id);
    await writeDB(db);
    return res.json({ ok: true });
  }

  return res.status(404).json({ error: 'Not found' });
}
