import prisma from "../prisma/client";
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
            password: password
        }
    })

    const userDTO = createUserDTO({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
    });

    return userDTO;
}