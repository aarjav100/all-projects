import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI as string;
if (!mongoUri) {
  // eslint-disable-next-line no-console
  console.error("Missing MONGODB_URI env var");
  process.exit(1);
}

const client = new MongoClient(mongoUri);
let db: ReturnType<MongoClient["db"]>;

async function start() {
  await client.connect();
  db = client.db("finance_app");
  const port = process.env.PORT ? Number(process.env.PORT) : 5174;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${port}`);
  });
}

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Transactions
app.post("/api/transactions", async (req, res) => {
  try {
    const { type, amount_original, currency_original, occurred_at, lat, lng, note } = req.body || {};
    if (!type || !["expense", "income"].includes(type)) return res.status(400).json({ error: "Invalid type" });
    const amount = Number(amount_original);
    if (!isFinite(amount) || amount <= 0) return res.status(400).json({ error: "Invalid amount" });
    if (!currency_original || typeof currency_original !== "string") return res.status(400).json({ error: "Invalid currency" });
    const doc = {
      type,
      amount_original: amount,
      currency_original,
      occurred_at: occurred_at ? new Date(occurred_at) : new Date(),
      lat: typeof lat === "number" ? lat : null,
      lng: typeof lng === "number" ? lng : null,
      note: note ?? null,
      created_at: new Date(),
    };
    const r = await db.collection("transactions").insertOne(doc);
    return res.json({ id: r.insertedId, ...doc });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
});

app.get("/api/transactions", async (_req, res) => {
  try {
    const items = await db.collection("transactions").find({}).sort({ created_at: -1 }).limit(200).toArray();
    return res.json(items.map((d: any) => ({ id: d._id, ...d })));
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
});

app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection("transactions").deleteOne({ _id: new ObjectId(id) });
    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
});

start().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});


