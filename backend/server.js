const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
if (!fs.existsSync("tickets.json")) fs.writeFileSync("tickets.json", "[]");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

app.post("/api/tickets", upload.single("receipt"), (req, res) => {
  const tickets = JSON.parse(fs.readFileSync("tickets.json"));

  const newTicket = {
    id: "TK-" + Date.now(),
    user: req.body.user || "Invitado",
    reference: req.body.reference,
    picks: JSON.parse(req.body.picks),
    receipt: req.file ? req.file.filename : null,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  tickets.push(newTicket);
  fs.writeFileSync("tickets.json", JSON.stringify(tickets, null, 2));

  res.json({
    success: true,
    ticket: newTicket,
  });
});

app.get("/api/tickets", (req, res) => {
  const tickets = JSON.parse(fs.readFileSync("tickets.json"));
  res.json(tickets);
});

app.listen(PORT, () => {
  console.log(`Backend funcionando en http://localhost:${PORT}`);
});