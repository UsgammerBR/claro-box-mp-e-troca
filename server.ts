import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Aumenta o limite para suportar fotos em base64
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  const DB_DIR = path.resolve("./backups");
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR);
  
  // API Routes
  app.get("/api/data", (req, res) => {
    const email = (req.query.email as string || 'default').replace(/[^a-z0-9]/gi, '_');
    const dbPath = path.join(DB_DIR, `${email}.json`);
    if (fs.existsSync(dbPath)) {
      res.json(JSON.parse(fs.readFileSync(dbPath, "utf-8")));
    } else {
      res.json({});
    }
  });

  app.post("/api/sync", (req, res) => {
    const { email, data } = req.body;
    const safeEmail = (email || 'default').replace(/[^a-z0-9]/gi, '_');
    fs.writeFileSync(path.join(DB_DIR, `${safeEmail}.json`), JSON.stringify(data, null, 2));
    res.json({ status: "success" });
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => res.sendFile(path.resolve("dist/index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

startServer();
