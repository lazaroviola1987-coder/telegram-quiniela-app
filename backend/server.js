const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

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

app.get("/", (req, res) => {
  res.send("Backend de quiniela funcionando correctamente");
});

app.post("/api/tickets", upload.single("receipt"), (req, res) => {
  const tickets = JSON.parse(fs.readFileSync("tickets.json"));

  const newTicket = {
    id: "TK-" + Date.now(),
    user: req.body.user || "Invitado",
    telegramId: req.body.telegramId || null,
    username: req.body.username || null,
    firstName: req.body.firstName || null,
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

app.get("/api/tickets/user/:telegramId", (req, res) => {
  const tickets = JSON.parse(fs.readFileSync("tickets.json"));
  const { telegramId } = req.params;

  const userTickets = tickets.filter(
    (ticket) => String(ticket.telegramId) === String(telegramId)
  );

  res.json(userTickets);
});

app.put("/api/tickets/:id/status", (req, res) => {
  const tickets = JSON.parse(fs.readFileSync("tickets.json"));
  const { id } = req.params;
  const { status } = req.body;

  const ticketIndex = tickets.findIndex((ticket) => ticket.id === id);

  if (ticketIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Ticket no encontrado",
    });
  }

  tickets[ticketIndex].status = status;
  tickets[ticketIndex].updatedAt = new Date().toISOString();

  fs.writeFileSync("tickets.json", JSON.stringify(tickets, null, 2));

  res.json({
    success: true,
    ticket: tickets[ticketIndex],
  });
});

app.listen(PORT, () => {
  console.log(`Backend funcionando en puerto ${PORT}`);
});