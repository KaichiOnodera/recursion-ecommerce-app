import { Item } from "../schemas/item"

export type GetRes = {
    '/items': {
        items: Item[]
    },
    '/admin/items': {
        items: Item[]
    }
}
