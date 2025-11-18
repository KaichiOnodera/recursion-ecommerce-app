import { Item } from "../schemas/item"

export type DeleteReq = {
    'admin/items/:id': {}
}

export type DeleteRes = {
    'admin/items/:id': { item: Item }
}
