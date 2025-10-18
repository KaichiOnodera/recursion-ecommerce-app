import { Item } from "@shared/schemas/item"

export type GetRes = {
    '/items': {
        items: Item[]
    }
}