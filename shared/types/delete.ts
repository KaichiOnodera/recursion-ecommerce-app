import { Item } from "@shared/schemas/item"

export type DeleteReq = {
    'admin/items/:id': {}
}

export type DeleteRes = {
    'admin/items/:id': { item: Item }
}
