const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const SECRET_KEY = process.env.JWT_SECRET || 'MyHyperSecureProject2025!@#EventMaster';

app.use(cors(
  {
    origin: '*', // Ou ton URL Netlify
    allowedHeaders: ['Content-Type', 'Authorization']
  }
));
app.use(express.json());

// --- MIDDLEWARE DE SÉCURITÉ ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Accès refusé, token manquant" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Token invalide" });
    req.user = user;
    next();
  });
};

// --- ROUTES AUTHENTIFICATION ---

app.post('/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword }
    });
    res.json({ message: "Utilisateur créé !", userId: user.id });
  } catch (error) {
    res.status(400).json({ error: "Email déjà utilisé" });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(403).json({ error: "Mot de passe incorrect" });

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, name: user.name } });
});

// --- ROUTES ÉVÉNEMENTS ---

// Liste de tous les événements
app.get('/events', async (req, res) => {
  const events = await prisma.event.findMany({
    include: {
      organizer: { select: { name: true } },
      participants: true
  }
  });
  res.json(events);
});

// Créer un événement
app.post('/events', authenticateToken, async (req, res) => {
  const { title, description, date, location } = req.body;
  const newEvent = await prisma.event.create({
    data: {
      title, description, date: new Date(date), location,
      organizerId: req.user.id
    }
  });
  res.json(newEvent);
});

// MODIFIER un événement (Tous les champs, seulement si on est l'organisateur)
app.put('/events/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, date, location } = req.body;

  try {
    // 1. Vérifier si l'événement existe
    const event = await prisma.event.findUnique({ where: { id: parseInt(id) } });
    if (!event) return res.status(404).json({ error: "Événement non trouvé" });

    // 2. Vérifier si l'utilisateur est bien l'organisateur
    if (event.organizerId !== req.user.id) {
      return res.status(403).json({ error: "Vous n'avez pas le droit de modifier cet événement" });
    }

    // 3. Mettre à jour tous les champs
    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(id) },
      data: { 
        title, 
        description, 
        date: new Date(date), 
        location 
      }
    });
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la modification" });
  }
});

// SUPPRIMER un événement
app.delete('/events/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const event = await prisma.event.findUnique({ where: { id: parseInt(id) } });

  if (event.organizerId !== req.user.id) {
    return res.status(403).json({ error: "Action interdite" });
  }

  await prisma.event.delete({ where: { id: parseInt(id) } });
  res.json({ message: "Événement supprimé" });
});

// S'INSCRIRE / SE DÉSINSCRIRE
app.post('/events/:id/register', authenticateToken, async (req, res) => {
  const eventId = parseInt(req.params.id);
  try {
    await prisma.registration.create({
      data: { userId: req.user.id, eventId: eventId }
    });
    res.json({ message: "Inscrit !" });
  } catch (e) {
    // Si déjà inscrit, on le désinscrit (toggle)
    await prisma.registration.deleteMany({
      where: { userId: req.user.id, eventId: eventId }
    });
    res.json({ message: "Désinscrit !" });
  }
});

const PORT = process.env.PORT || 5000; 
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});