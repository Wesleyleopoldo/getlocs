import prisma from "../prisma/client";
import { createDeviceDTO, DeviceDTO } from "../dtos/device.dto";
import { AppError } from "../errors/errors";

export const createDevice = async (userId: string, name: string): Promise<DeviceDTO> => {
    const findDevice = await prisma.device.findFirst({
        where: { name: name },
    });

    if(findDevice) {
        throw new AppError("Já existe um dispositivo com esse nome....", 409);
    }

    const findUser = await prisma.user.findUnique({
        where: { id: userId },
    });

    if(!findUser) {
        throw new AppError("Usuário não encontrado...", 404);
    }
    
    const newDevice = await prisma.device.create({
        data: {
            name: name,
            userId: userId,
        }
    });

    const deviceDTO = createDeviceDTO({
        name: newDevice.name,
        uuidUnique: newDevice.uuidUnique,
        createdAt: newDevice.createdAt,
    });

    return deviceDTO;
}

export const putDeviceName = async (userId: string, deviceUuid: string, newName: string): Promise<DeviceDTO> => {

    const findUser = await prisma.user.findUnique({
        where: { id: userId }
    });

    if(!findUser) throw new AppError("Usuário não existe na base de dados...", 404);

    const findDevice = await prisma.device.findUnique({
        where: { uuidUnique: deviceUuid }
    });

    if(!findDevice) throw new AppError("Dispositivo não existe na base de dados...", 404);

    if(findDevice.userId !== findUser.id) throw new AppError("Ação não autorizada...", 403);

    const device = await prisma.device.update({
        where: { uuidUnique: deviceUuid },
        data: { name: newName },
    });

    const deviceDTO = createDeviceDTO({
        name: device.name,
    });

    return deviceDTO;
}