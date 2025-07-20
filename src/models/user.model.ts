import { Role } from "@prisma/client";

export type UserModel = {
    id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    role: Role;
};