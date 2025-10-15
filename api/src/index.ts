import express, { Request, Response } from "express";
import { config } from "dotenv";

// Load environment variables from .env file
config();

// Initialize Prisma Client
import { PrismaClient } from "@prisma/client";
 

const prisma = new PrismaClient();

const app = express();

app.get("/", async (req: Request, res: Response) => {
  await prisma.users.findMany().then((users) => {
    res.send(users);
  });
  // res.send("Hello World!");
});

app.listen(8000, '0.0.0.0', () => {
  console.log('Server running on port 8000');
  console.log('Database URL:', process.env.DATABASE_URL);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

