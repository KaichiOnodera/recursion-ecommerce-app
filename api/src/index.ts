import express, { Request, Response } from "express";
import { config } from "dotenv";

// Load environment variables from .env file
config();

// Initialize Prisma Client
import { PrismaClient } from "@prisma/client";
import { itemsRouter } from "./contexts/items";


const prisma = new PrismaClient();

const app = express();

app.get("/", async (_req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/items", itemsRouter);

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