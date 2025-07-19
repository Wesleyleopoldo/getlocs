import mockPrisma from "../../prisma/mocks/prisma"
import { Role } from "@prisma/client";
import { createAdmin, createUser, getUser, putUsername, putEmail, putPassword, deleteUser, getAllUsers } from "../user.service";
import { AppError } from "../../errors/errors";
jest.mock("../../prisma/client", () => mockPrisma);


describe("createUser()", () => {

    const input = { id: "123e4-abcde-4567", name: "Wesley Silva", email: "testewesley@gmail.com", password: "123456" };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Deve criar um usuário e retornar o dto dele...", async () => {
        mockPrisma.user.findUnique.mockResolvedValueOnce(null)
        mockPrisma.user.create.mockResolvedValueOnce(input);

        const createdUser = await createUser(input.name, input.email, input.password);

        console.log(createdUser);

        expect(createdUser).toEqual({
            name: input.name,
            email: input.email
        });

        expect(mockPrisma.user.create).toHaveBeenCalledWith({
            data: {
                email: input.email,
                name: input.name,
                password: input.password,
                role: Role.basic
            }
        });
    });

    it("Deve lançar uma exceção de email já cadastrado...", async () => {
        mockPrisma.user.findUnique.mockResolvedValueOnce(input);

        await expect(createUser(input.name, input.email, input.password)).rejects.toMatchObject({
            message: "Email já cadastrado!!!",
            statusCode: 409
        });
    });
});

describe("createAdmin()", () => {

    const input = { id: "123e4-abcde-4567", name: "Wesley Silva", email: "testewesley@gmail.com", password: "123456" };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Deve retornar os dados do novo administrador...", async () => {
        mockPrisma.user.findUnique.mockResolvedValueOnce(null);
        mockPrisma.user.create.mockResolvedValueOnce(input);

        const createdAdmin = await createAdmin(input.name, input.email, input.password);

        expect(createdAdmin).toEqual({
            name: input.name,
            email: input.email,
        });

        expect(mockPrisma.user.create).toHaveBeenCalledWith({
            data: {
                email: input.email,
                name: input.name,
                password: input.password,
                role: Role.admin
            }
        });
    });

    it("Deve lançar uma exceção de email já cadastrado...", async () => {
        mockPrisma.user.findUnique.mockResolvedValueOnce(input);

        await expect(createAdmin(input.name, input.email, input.password)).rejects.toMatchObject({
            message: "Email já cadastrado!!!",
            statusCode: 409
        });
    });
});

describe("getUser()", () => {

    const input = { id: "123e4-abcde-4567", name: "Wesley Silva", email: "testewesley@gmail.com", password: "123456" };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Deve retornar dados de um usuário...", async () => {
        mockPrisma.user.findUnique.mockResolvedValueOnce(input);
        const user = await getUser(input.id);

        console.log(user);

        expect(user).toEqual({
            name: input.name,
            email: input.email
        });

        expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: input.id }
        });
    });

    it("Deve lançar uma exceção de usuário não encontrado...", async () => {
        mockPrisma.user.findUnique.mockResolvedValueOnce(null);

        await expect(getUser(input.id)).rejects.toMatchObject({
            message: "Usuário não encontrado...",
            statusCode: 404,
        });
    });
});

describe("putUsername()", () => {
    const input = { id: "123e4-abcde-4567", name: "Wesley Silva", email: "testewesley@gmail.com", password: "123456" };
    const newName = { name: "Nome alterado" };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Deve retornar o novo nome do usuário...", async () => {
        mockPrisma.user.findUnique.mockResolvedValueOnce(input);
        mockPrisma.user.update.mockResolvedValueOnce(newName);

        const newUsername = await putUsername(input.id, newName.name);

        expect(newUsername).toEqual({
            name: newName.name
        });

        expect(mockPrisma.user.update).toHaveBeenCalledWith({
            where: { id: input.id },
            data: { name: newName.name },
        });
    });

    it("Deve lançar uma exceção de usuário não encontrado...", async () => {
        mockPrisma.user.findUnique.mockResolvedValueOnce(null);

        await expect(getUser(input.id)).rejects.toMatchObject({
            message: "Usuário não encontrado...",
            statusCode: 404,
        });
    });
});

describe("putEmail()", () => {
    const input = { id: "123e4-abcde-4567", name: "Wesley Silva", email: "testewesley@gmail.com", password: "123456" };
    const newEmail = { email: "emailalterado@gmail.com" };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Deve retornar o novo email do usuário...", async () => {
        mockPrisma.user.findUnique.mockResolvedValueOnce(input);
        mockPrisma.user.update.mockResolvedValueOnce(newEmail);

        const newUserEmail = await putEmail(input.id, newEmail.email);

        expect(newUserEmail).toEqual({
            email: newEmail.email,
        });

        expect(mockPrisma.user.update).toHaveBeenCalledWith({
            where: { id: input.id },
            data: { email: newEmail.email },
        });
    });

    it("Deve lançar uma exceção de usuário não encontrado...", async () => {
        mockPrisma.user.findUnique.mockResolvedValueOnce(null);

        await expect(putEmail(input.id, newEmail.email)).rejects.toMatchObject({
            message: "Usuário não encontrado...",
            statusCode: 404,
        });
    });
});

describe("putPassword()", () => {
    const input = { id: "123e4-abcde-4567", name: "Wesley Silva", email: "testewesley@gmail.com", password: "123456" };
    const newPassword = { password: "senhaAlterada123" };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Deve retornar a nova senha do usuário...", async () => {
        mockPrisma.user.findUnique.mockResolvedValueOnce(input);
        mockPrisma.user.update.mockResolvedValueOnce(newPassword);

        const newUserPassword = await putPassword(input.id, newPassword.password);

        expect(newUserPassword).toEqual({
            password: newPassword.password,
        });

        expect(mockPrisma.user.update).toHaveBeenCalledWith({
            where: { id: input.id },
            data: { password: newPassword.password },
        });
    });

    it("Deve lançar uma exceção caso o usuário não exista...", async () => {
        mockPrisma.user.findUnique.mockResolvedValueOnce(null);

        await expect(putPassword(input.id, newPassword.password)).rejects.toMatchObject({
            message: "Usuário não encontrado...",
            statusCode: 404,
        });
    });
});

describe("deleteUser()", () => {
    const input = { id: "123e4-abcde-4567", name: "Wesley Silva", email: "testewesley@gmail.com", password: "123456" };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Deve retornar uma mensagem de sucesso caso tenha conseguido deletar o usuário", async () => {
        mockPrisma.user.findUnique.mockResolvedValueOnce(input);
        mockPrisma.user.delete.mockResolvedValueOnce(input);

        const userDeleted = await deleteUser(input.id);

        expect(userDeleted).toEqual({
            message: `Usuário ${input.name} deletado.`
        });
        expect(mockPrisma.user.delete).toHaveBeenCalledWith({
            where: { id: input.id },
        });
    });

    it("Deve lançar uma exceção caso o usuário não exista...", async () => {
        mockPrisma.user.findUnique.mockResolvedValueOnce(null);

        await expect(deleteUser(input.id)).rejects.toMatchObject({
            message: "Usuário não encontrado...",
            statusCode: 404,
        });
    });
});

describe("getAllUsers()", () => {

    const datas = [
        {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            name: 'Alice',
            email: 'alice@example.com',
            password: 'hashedpassword1',
            role: Role.basic,
        },
        {
            id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            name: 'Bob',
            email: 'bob@example.com',
            password: 'hashedpassword2',
            role: Role.basic,
        },
        {
            id: '9b2c3bde-2cb7-4bd6-9102-cb22a4eafd63',
            name: 'Carol',
            email: 'carol@example.com',
            password: 'hashedpassword3',
            role: Role.basic,
        },
    ];

    const returnDatasExpected = [
        {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            name: 'Alice',
            email: 'alice@example.com',
            role: Role.basic,
        },
        {
            id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            name: 'Bob',
            email: 'bob@example.com',
            role: Role.basic,
        },
        {
            id: '9b2c3bde-2cb7-4bd6-9102-cb22a4eafd63',
            name: 'Carol',
            email: 'carol@example.com',
            role: Role.basic,
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Deve retornar uma lista de usuários", async () => {
        const input = { id: "123e4-abcde-4567", name: "Wesley Silva", email: "testewesley@gmail.com", password: "123456", role: Role.admin };

        mockPrisma.user.findUnique.mockResolvedValueOnce(input);
        mockPrisma.user.findMany.mockResolvedValueOnce(datas);

        const allUsers = await getAllUsers(input.id);

        expect(allUsers).toEqual(returnDatasExpected);

        expect(mockPrisma.user.findMany).toHaveBeenCalledWith();
    });
});