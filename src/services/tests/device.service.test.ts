import mockPrisma from "../../prisma/mocks/prisma";
import { createDevice, putDeviceName } from "../device.service";

jest.mock("../../prisma/client", () => mockPrisma);

describe("createDevice()", () => {

    const user = { id: "123e4-abcde-4567", name: "Wesley Silva", email: "testewesley@gmail.com", password: "123456" };
    const deviceData = {
        id: 1,
        name: 'Meu Samsung',
        uuidUnique: 'cb735af0-79ef-4e14-8329-cc0c5d6f7201',
        status: true,
        battery: 85,
        longitude: -46.57421,
        latitude: -23.551,
        userId: user.id,
        createdAt: new Date(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Deve retornar nome, id único e data e horário de criação do dispositivo...", async () => {
        mockPrisma.device.findFirst.mockResolvedValueOnce(null);
        mockPrisma.user.findUnique.mockResolvedValueOnce(user);
        mockPrisma.device.create.mockResolvedValueOnce(deviceData);

        const createdDevice = await createDevice(user.id, deviceData.name);

        console.log(createdDevice);

        expect(createdDevice).toEqual({
            name: deviceData.name,
            uuidUnique: deviceData.uuidUnique,
            createdAt: deviceData.createdAt,
        });

        expect(mockPrisma.device.create).toHaveBeenCalledWith({
            data: {
                name: deviceData.name,
                userId: deviceData.userId,
            }
        });
    });
});

describe("putName()", () => {

    const user = { id: "123e4-abcde-4567", name: "Wesley Silva", email: "testewesley@gmail.com", password: "123456" };

    const deviceData = {
        id: 1,
        name: 'Meu Samsung',
        uuidUnique: 'cb735af0-79ef-4e14-8329-cc0c5d6f7201',
        status: true,
        battery: 85,
        longitude: -46.57421,
        latitude: -23.551,
        userId: user.id,
        createdAt: new Date(),
    };

    const newName = { name: "Nome alterado" }

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Deve atualizar o nome do dispositivo", async () => {
        mockPrisma.user.findUnique.mockResolvedValueOnce(user);
        mockPrisma.device.findUnique.mockResolvedValueOnce(deviceData);
        mockPrisma.device.update.mockResolvedValueOnce(newName);

        const newDeviceName = await putDeviceName(user.id, deviceData.uuidUnique, newName.name);

        console.log(newDeviceName);

        expect(newDeviceName).toEqual({
            name: newName.name,
        });

        expect(mockPrisma.device.update).toHaveBeenCalledWith({
            where: { uuidUnique: deviceData.uuidUnique },
            data: { name: newName.name },
        });
    });
    
    it("Deve retornar um erro de usuário não encontrado", async () => {
        
        mockPrisma.user.findUnique.mockResolvedValueOnce(null);
        mockPrisma.device.findUnique.mockResolvedValueOnce(deviceData);
        mockPrisma.device.update.mockResolvedValueOnce(newName);
        
        await expect(putDeviceName(user.id, deviceData.uuidUnique, newName.name)).rejects.toMatchObject({
            message: "Usuário não existe na base de dados...",
            statusCode: 404,
        });
    });
    
    it("Deve retornar um erro de dispositivo não encontrado", async () => {
    
        mockPrisma.user.findUnique.mockReset(); // Resetar os mocks anteriores...
        mockPrisma.device.findUnique.mockReset();
        mockPrisma.device.update.mockReset();
    
        mockPrisma.user.findUnique.mockResolvedValueOnce(user);
        mockPrisma.device.findUnique.mockResolvedValueOnce(null);
        mockPrisma.device.update.mockResolvedValueOnce(newName);
    
        await expect(putDeviceName(user.id, deviceData.uuidUnique, newName.name)).rejects.toMatchObject({
            message: "Dispositivo não existe na base de dados...",
            statusCode: 404,
        });
    });

    it("Deve retornar 403 Forbbiden se o usuário não for dono do dispositivo...", async () => {

    });
});