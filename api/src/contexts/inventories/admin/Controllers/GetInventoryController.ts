import express from "express";
import { GetInventorytInteractor } from "../Interactors/GetInventorytInteractor";

export class GetInventoryController{
    constructor(private readonly getInventorytInteractor: GetInventorytInteractor){}

    async execute(
        req: express.Request<{itemId: string}>,
        res: express.Response<any>
    ){
        const itemId = parseInt(req.params.itemId);

        const inventory = await this.getInventorytInteractor.execute(Number(itemId));
        
        if(!inventory){
            return res.status(404).json({message: "Inventory not found"});
        }

        res.status(200).json({inventory});
    }
}