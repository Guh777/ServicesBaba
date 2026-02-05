const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// banco
const db = new sqlite3.Database("./database.db");

// criar tabela
db.run(`
  CREATE TABLE IF NOT EXISTS motos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    servico TEXT,
    status TEXT,
    imagem TEXT,
    descricao TEXT
  )
`);
// listar motos
app.get("/motos", (req, res) => {
  db.all("SELECT * FROM motos", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// salvar moto
app.post("/motos", (req, res) => {
  const { nome, servico, status, imagem } = req.body;

  db.run(
    "INSERT INTO motos (nome, servico, status, imagem) VALUES (?, ?, ?, ?)",
    [nome, servico, status, imagem],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});
app.put("/motos/:id", (req, res) => {
  const { nome, servico, status, imagem, descricao } = req.body;
  const { id } = req.params;

  db.run(
    `UPDATE motos 
     SET nome=?, servico=?, status=?, imagem=?, descricao=?
     WHERE id=?`,
    [nome, servico, status, imagem, descricao, id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ updated: this.changes });
    }
  );
});
app.listen(PORT, () =>
  console.log(`Servidor rodando em http://localhost:${PORT}`)
);

