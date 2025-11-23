import { PrismaClient } from "@prisma/client"; 
import { Inventory } from "../../domains/entities/Inventory";
import { IInventoryRepository } from "../../domains/repositories/IInventoryRepository";

export class InventoryRepository implements IInventoryRepository {
    constructor(private readonly prisma: PrismaClient) {};
    async findByItemId(itemId: number): Promise<Inventory | null> {
        const inventory = await this.prisma.inventories.findUnique({
            where: { itemId },
        });
        return inventory;   
    }
}