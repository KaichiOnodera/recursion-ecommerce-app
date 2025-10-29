import { User } from "@shared/schemas/user"

// エンドポイント統一する場合、修正
export type PostRes = {
    'auth/user/login': {
        user: User
    }
    'auth/admin/login': {
        user: User
    }
}
