/**
 * Created by Syed Afzal
 */
require("./config/config");

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");

const app = express();

//connection from db here
db.connect(app);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//  adding routes
require("./routes")(app);

// --- Simple routes for lab validation ---
app.get('/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.get('/api/products', (req, res) => {
  // Static response for validation; wire to Mongo later if you want
  res.json([{ id: 1, name: 'Sample Product', qty: 3 }]);
});

// POST /api/restock -> calls Azure Function
app.post('/api/restock', async (req, res) => {
  try {
    const payload = {
      eventType: 'restock',
      productId: req.body?.id || 'SKU123',
      quantity:  req.body?.qty || 5,
      message:   'Manual restock from API'
    };

    const url = process.env.FUNCTION_URL;
    if (!url) return res.status(500).json({ ok: false, error: 'FUNCTION_URL not set' });

    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await r.json().catch(() => ({}));  // handle empty body
    return res.json({ ok: true, sent: payload, function: data });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// POST /api/lowstock -> simulate "low stock" alert
app.post('/api/lowstock', async (req, res) => {
  try {
    const payload = {
      eventType: 'low_stock',
      productId: req.body?.id || 'SKU123',
      quantity:  req.body?.qty || 0,
      message:   'Low stock threshold reached'
    };
    if (!process.env.FUNCTION_URL) return res.status(500).json({ ok: false, error: 'FUNCTION_URL not set' });

    const r = await fetch(process.env.FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await r.json().catch(() => ({}));
    res.json({ ok: true, sent: payload, function: data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// OPTIONAL: POST /api/newproduct -> simulate new product event
app.post('/api/newproduct', async (req, res) => {
  try {
    const payload = {
      eventType: 'new_product',
      productId: req.body?.id || 'SKU999',
      quantity:  req.body?.qty || 10,
      message:   'New product added from store floor'
    };
    if (!process.env.FUNCTION_URL) return res.status(500).json({ ok: false, error: 'FUNCTION_URL not set' });

    const r = await fetch(process.env.FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await r.json().catch(() => ({}));
    res.json({ ok: true, sent: payload, function: data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: e.message });
  }
});


app.on("ready", () => {
  app.listen(3000, () => {
    console.log("Server is up on port", 3000);
  });
});

module.exports = app;
