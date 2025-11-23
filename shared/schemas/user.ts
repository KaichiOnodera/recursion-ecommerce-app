export type User = {
    id: number;
    lastName: string;
    firstName: string;
    email: string;
    role: 'USER' | 'ADMIN';
}
