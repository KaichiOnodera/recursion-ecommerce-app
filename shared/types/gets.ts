import { Item } from "../schemas/item"
import { User } from "../schemas/user"

export type GetRes = {
    '/items': {
        items: Item[]
    },
    '/admin/items': {
        items: Item[]
    },
    '/auth/me': {
        user: User
    }
}
