import prisma from "../prisma/client";
import { Role } from "@prisma/client";
import { createUserDTO, UserDTO } from "../dtos/user.dto";
import { AppError } from "../errors/errors";

export const createUser = async (name: string, username: string, email: string, password: string): Promise<UserDTO> => {
    const findUser = await prisma.user.findUnique({
        where: { email: email }
    });

    if(findUser) {
        throw new AppError("Email já cadastrado!!!", 409);
    }

    const findUserByUsername = await prisma.user.findUnique({
        where: { username: username }
    });

    if(findUserByUsername) {
        throw new AppError("Username não disponível!!!", 409);
    }

    const newUser = await prisma.user.create({
        data: {
            name: name,
            username: username,
            email: email,
            password: password,
            role: Role.basic,
        }
    });

    const userDTO = createUserDTO({
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
    });

    return userDTO;
}

export const createAdmin = async (name: string, username: string, email: string, password: string): Promise<UserDTO> => {
    const findAdmin = await prisma.user.findUnique({
        where: { email: email }
    });

    if(findAdmin) {
        throw new AppError("Email já cadastrado!!!", 409);
    }

    const findUserByUsername = await prisma.user.findUnique({
        where: { username: username }
    });

    if(findUserByUsername) {
        throw new AppError("Username não disponível!!!", 409);
    }

    const newAdmin = await prisma.user.create({
        data: {
            name: name,
            username: username,
            email: email,
            password: password,
            role: Role.admin,
        }
    })

    const userDTO = createUserDTO({
        name: newAdmin.name,
        username: newAdmin.username,
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

export const putName = async (id: string, newName: string): Promise<UserDTO> => {
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

export const putPassword = async (id: string, newPassword: string): Promise<object> => {
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

    return { message: "Senha alterada com sucesso!!!" };
}

export const deleteUser = async (id: string): Promise<object> => {
    const findUser = await prisma.user.findUnique({
        where: { id: id },
    });

    if(!findUser) {
        throw new AppError("Usuário não encontrado...", 404);
    }

    try {
        const user = await prisma.user.delete({
            where: { id: id },
        });

        return { message: `Usuário ${user.name} deletado.` }
    } catch(error) {
        throw new AppError("Erro inesperado ao tentar deletar usuário..." + error, 500);
    }
}

export const getAllUsers = async (id: string): Promise<UserDTO[]> => {
    const findUser = await prisma.user.findUnique({
        where: { id: id },
    });

    if(!findUser) {
        throw new AppError("Usuário não encontrado...", 404);
    }

    if(findUser.role === Role.basic) {
        throw new AppError("Você não tem privilégios de administrador...", 403);
    }

    const allUsers = await prisma.user.findMany();

    const allUsersDTO = allUsers.map(user => createUserDTO({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }));

    return allUsersDTO;
}