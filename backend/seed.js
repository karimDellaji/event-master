const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs'); // On ajoute le cryptage
const prisma = new PrismaClient();

async function main() {
  // On efface tout pour repartir sur du propre (Optionnel mais conseillé)
  await prisma.registration.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.user.deleteMany({});

  // On crée un mot de passe crypté
  const hashedPassword = await bcrypt.hash("password123", 10);

  // 1. On crée l'utilisateur
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Karim Admin',
    },
  });

  // 2. On crée un événement de test
  await prisma.event.create({
    data: {
      title: "Atelier Robotique",
      description: "Apprendre à programmer un Arduino",
      date: new Date('2025-02-15'),
      location: "Gabes, Tunisie",
      organizerId: user.id
    },
  });

  console.log("Base de données réinitialisée avec succès !");
  console.log("Email: test@example.com | Pass: password123");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());