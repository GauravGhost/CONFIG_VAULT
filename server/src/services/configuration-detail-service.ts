import type { ConfigurationDetailCreate } from "@config-vault/shared";
import ConfigurationDetailRepository from "../repository/configuration-detail-repository";

class ConfigurationDetailService {
private readonly configurationDetailRepository: ConfigurationDetailRepository;

    constructor() {
        this.configurationDetailRepository = new ConfigurationDetailRepository();
    }

    async createConfigurationDetail(data: ConfigurationDetailCreate){
        const detail = await this.configurationDetailRepository.create(data);
        return detail;
    }
}

export default ConfigurationDetailService;