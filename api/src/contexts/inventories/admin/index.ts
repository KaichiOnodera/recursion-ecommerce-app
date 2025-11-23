import { GetInventorytInteractor } from "./Interactors/GetInventorytInteractor";
import { GetInventoryController } from "./Controllers/GetInventoryController";
import { InventoryRepository } from "../infrastructures/repositories/InventoryRepository";
import { PrismaClient } from "@prisma/client";
import express from "express";
import { verifyAccessToken } from "../../../middlewares/verifyAccesToken";
import { verifyAdmin } from "../../../middlewares/verifyAdmin";

const adminInventoriesRouter = express.Router();

const prisma = new PrismaClient();
const inventoryRepository = new InventoryRepository(prisma);
const getInventorytInteractor = new GetInventorytInteractor(inventoryRepository);
const getInventoryController = new GetInventoryController(getInventorytInteractor);

// 認証チェック
adminInventoriesRouter.use(verifyAccessToken);
adminInventoriesRouter.use(verifyAdmin);

adminInventoriesRouter.get(
    '/:itemId',
    getInventoryController.execute.bind(getInventoryController),
);