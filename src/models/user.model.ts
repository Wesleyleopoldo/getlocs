import { Role } from "@prisma/client";

export type UserModel = {
    id: string;
    name: string;
    email: string;
    password: string;
    role: Role;
};