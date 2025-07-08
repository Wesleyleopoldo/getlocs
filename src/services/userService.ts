import prisma from "../prisma/client";
import { createUserDTO, UserDTO } from "../dtos/user.dto";

export const createUser = async (name: string, email: string, password: string): Promise<UserDTO> => {
    
}