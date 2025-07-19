import mockPrisma from "../../prisma/mocks/prisma";
import { createDevice } from "../device.service";

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
    })

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