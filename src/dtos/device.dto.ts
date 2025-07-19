import { DeviceModel } from "../models/device.model";
import { cleanDTO } from "./helpers/cleanDTO";

export type DeviceDTO = Partial<DeviceModel>;

export function createDeviceDTO(data: DeviceDTO): DeviceDTO {
    return cleanDTO(data);
}