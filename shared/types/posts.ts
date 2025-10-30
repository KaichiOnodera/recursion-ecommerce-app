import { User } from "@shared/schemas/user"

export type PostRes = {
    'auth/login': {
        user: User
    }
}
