import prisma from "../prisma/client";
import { Role } from "@prisma/client";
import { createUserDTO, UserDTO } from "../dtos/user.dto";
import { AppError } from "../errors/errors";

export const createUser = async (name: string, email: string, password: string): Promise<UserDTO> => {
    const findUser = await prisma.user.findUnique({
        where: { email: email }
    });

    if(findUser) {
        throw new AppError("Email já cadastrado!!!", 409);
    }

    const newUser = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: password,
            role: Role.basic,
        }
    })

    const userDTO = createUserDTO({
        name: newUser.name,
        email: newUser.email,
    });

    return userDTO;
}

export const createAdmin = async (name: string, email: string, password: string): Promise<UserDTO> => {
    const findAdmin = await prisma.user.findUnique({
        where: { email: email }
    });

    if(findAdmin) {
        throw new AppError("Email já cadastrado!!!", 409);
    }

    const newAdmin = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: password,
            role: Role.admin,
        }
    })

    const userDTO = createUserDTO({
        name: newAdmin.name,
        email: newAdmin.email,
    });

    return userDTO;
}

export const getUser = async (id: string): Promise<UserDTO> => {
    const user = await prisma.user.findUnique({
        where: { id: id }
    });

    if(!user) {
        throw new AppError("Usuário não encontrado...", 404);
    }

    const userDTO = createUserDTO({
        name: user.name,
        email: user.email,
    });

    return userDTO;
}

export const putUsername = async (id: string, newName: string): Promise<UserDTO> => {
    const findUser = await prisma.user.findUnique({
        where: { id: id }
    });

    if(!findUser) {
        throw new AppError("Usuário não encontrado...", 404);
    }

    const user = await prisma.user.update({
        where: { id: findUser.id },
        data: { name: newName }
    });

    const userDTO = createUserDTO({
        name: user.name
    });

    return userDTO;
}

export const putEmail = async (id: string, newEmail: string): Promise<UserDTO> => {
    const findUser = await prisma.user.findUnique({
        where: { id: id }
    });

    if(!findUser) {
        throw new AppError("Usuário não encontrado...", 404);
    }

    const user = await prisma.user.update({
        where: { id: findUser.id },
        data: { email: newEmail },
    });

    const userDTO = createUserDTO({
        email: user.email,
    });

    return userDTO;
}

export const putPassword = async (id: string, newPassword: string): Promise<UserDTO> => {
    const findUser = await prisma.user.findUnique({
        where: { id: id }
    });

    if(!findUser) {
        throw new AppError("Usuário não encontrado...", 404);
    }

    const user = await prisma.user.update({
        where: { id: findUser.id },
        data: { password: newPassword },
    });

    const userDTO = createUserDTO({
        password: user.password,
    });

    return userDTO;
}