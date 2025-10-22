import { User } from "../domains/entities/User";

export interface ICreateUserRequest {
    lastName: string;
    firstName: string;
    email: string;
    password: string;
    role: number;
}

export interface ICreateUserInteractor {
    execute(request: ICreateUserRequest): Promise<User>;
}