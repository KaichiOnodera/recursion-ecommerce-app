import { User } from "@shared/schemas/user"

export type PostReq = {
    'auth/login': {
        email: string
        password: string
    }
}

export type PostRes = {
    'auth/login': {
        user: User
    }
}
