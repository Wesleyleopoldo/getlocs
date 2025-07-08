import mockPrisma from "../../prisma/mocks/prisma"
import { createUser } from "../user.service";
import { AppError } from "../../errors/errors";
jest.mock("../../prisma/client", () => mockPrisma);


describe("createUser()", () => {
    
    const input = { id: "123e4-abcde-4567", name: "Wesley Silva", email: "testewesley@gmail.com", password: "123456"};

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Deve criar um usuário e retornar o dto dele", async () => {
        mockPrisma.user.findUnique.mockResolvedValueOnce(null)
        mockPrisma.user.create.mockResolvedValueOnce(input);

        const createdUser = await createUser(input.name, input.email, input.password);

        console.log(createdUser);

        expect(createdUser).toEqual({
            id: "123e4-abcde-4567", 
            name: "Wesley Silva", 
            email: "testewesley@gmail.com"
        });

        expect(mockPrisma.user.create).toHaveBeenCalledWith({ data: input })

        mockPrisma.user.findUnique.mockResolvedValueOnce(input);

        const rejectedUser = await createUser(input.name, input.email, input.password);

        console.log(rejectedUser);

        expect(rejectedUser).rejects.toThrow(AppError);
        expect(rejectedUser).rejects.toThrow("Email já cadastrado!!!");
    });

})