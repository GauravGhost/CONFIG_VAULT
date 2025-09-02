import type { ConfigurationDetailCreate, ConfigurationDetailUpdate } from "@config-vault/shared";
import ConfigurationDetailRepository from "../repository/configuration-detail-repository";
import ApiError from "../utils/error";
import status from "http-status";
import { removeUndefinedValues } from "../utils/type-helpers";

class ConfigurationDetailService {
private readonly configurationDetailRepository: ConfigurationDetailRepository;

    constructor() {
        this.configurationDetailRepository = new ConfigurationDetailRepository();
    }

    async createConfigurationDetail(data: ConfigurationDetailCreate){
        const detail = await this.configurationDetailRepository.create(data);
        return detail;
    }

    async updateConfigurationDetail(id: string, data: ConfigurationDetailUpdate) {
        const isDetailExist = await this.configurationDetailRepository.findById(id);
        if (!isDetailExist) {
            throw new ApiError("Configuration detail not found", status.BAD_REQUEST);
        }

        const cleanData = removeUndefinedValues(data);
        const updatedDetail = await this.configurationDetailRepository.update(id, cleanData);
        return updatedDetail;
    }

    async deleteConfigurationDetail(id: string) {
        const isDetailExist = await this.configurationDetailRepository.findById(id);
        if (!isDetailExist) {
            throw new ApiError("Configuration detail not found", status.BAD_REQUEST);
        }

        await this.configurationDetailRepository.delete(id);
        return { success: true };
    }
}

export default ConfigurationDetailService;