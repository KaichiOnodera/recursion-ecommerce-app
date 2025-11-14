import express from 'express';
import { GetRes } from '@shared/types/gets';
import { IGetItemImagesInteractor } from '../usecases/IGetItemImagesInteractor';

export class GetItemImagesController {
    constructor(private readonly getItemImagesInteractor: IGetItemImagesInteractor) {}
    
    async execute(

    req: express.Request<{id : string}>,
    res: express.Response<GetRes['/items/:id/images']>

    ){
    const itemId = parseInt(req.params.id);

    if (isNaN(itemId)) {
      return res.status(400);
    }

    const images = await this.getItemImagesInteractor.execute(itemId);
    
    const responseImages = images.map((image) => ({
      id: image.id,
      itemId: image.itemId,
      src: image.src,
      order: image.order,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
    }));

    res.status(200).json({ images: responseImages });
  }
}