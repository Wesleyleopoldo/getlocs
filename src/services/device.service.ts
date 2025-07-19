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