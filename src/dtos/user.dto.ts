import { UserModel } from "../models/user.model";
import { cleanDTO } from "./helpers/cleanDTO";

export type UserDTO = Partial<UserModel>;

export function createUserDTO(data: UserDTO): UserDTO {
    return cleanDTO(data);
}