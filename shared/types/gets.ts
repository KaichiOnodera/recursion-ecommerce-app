import { Item } from "@shared/schemas/item"
import { ItemImage } from "@shared/schemas/itemimage"

export type GetRes = {
    '/items': {
        items: Item[]
    }
    '/items/:id/images': {
        images: ItemImage[]
    }

}