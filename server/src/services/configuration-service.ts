import type { ConfigurationUpdate, ConfigurationWithDetailCreateBackend } from "@config-vault/shared";
import ConfigurationRepository from "../repository/configuration-repository";
import ApiError from "../utils/error";
import status from "http-status";
import ConfigurationDetailService from "./configuration-detail-service";
import { removeUndefinedValues } from "../utils/type-helpers";

class ConfigurationService {
    private readonly configurationRepository: ConfigurationRepository;
    private readonly configurationDetailService: ConfigurationDetailService;
    constructor() {
        this.configurationRepository = new ConfigurationRepository();
        this.configurationDetailService = new ConfigurationDetailService();
    }

    public async getConfigurationById(id: string) {
        const configuration = await this.configurationRepository.findById(id);
        return configuration;
    }

    public async getConfigurationByIdWithDetails(id: string) {
        const rows = await this.configurationRepository.findWithRelations({
            relations: [{
                table: 'configuration_detail',
                alias: 'cd',
                on: 'configurations.id = cd.configuration_id',
                columns: ['id', 'environment', 'env', 'code', 'created_at', 'updated_at']
            }],
            where: { id },
            orderBy: 'cd.environment ASC'
        });

        const configurationWithDetails = this.configurationRepository.transformRelationalData(
            rows,
            'id',
            [{
                name: 'configuration_details',
                prefix: 'cd',
                key: 'id',
                multiple: true
            }]
        );

        return configurationWithDetails.length > 0 ? configurationWithDetails[0] : null;
    }
    
    public async getConfigurationsByProjectId(id: string) {
        const configurations = await this.configurationRepository.findBy({ project_id: id });
        return configurations;
    }

    public async getConfigurationsByProjectIdWithDetails(projectId: string) {
        const rows = await this.configurationRepository.findWithRelations({
            relations: [{
                table: 'configuration_detail',
                alias: 'cd',
                on: 'configurations.id = cd.configuration_id',
                columns: ['id', 'environment', 'env', 'code', 'created_at', 'updated_at']
            }],
            where: { project_id: projectId },
            orderBy: 'configurations.created_at ASC, cd.environment ASC'
        });

        // Transform the flat rows into nested structure
        const configurationsWithDetails = this.configurationRepository.transformRelationalData(
            rows,
            'id',
            [{
                name: 'configuration_details',
                prefix: 'cd',
                key: 'id',
                multiple: true
            }]
        );

        return configurationsWithDetails;
    }

    public async createConfiguration(payload: ConfigurationWithDetailCreateBackend) {
        const { configuration_details, ...configurationPayload } = payload;
        configurationPayload.is_active = true;
        await this.configurationRepository.transaction(async () => {
            const config = await this.configurationRepository.create(configurationPayload);
            const configId = config.id;
            if (!configId) {
                throw new ApiError("Configuration creation failed", status.BAD_REQUEST);
            }
            configuration_details.configuration_id = configId;
            await this.configurationDetailService.createConfigurationDetail(configuration_details);
            return config;
        });
    }

    public async updateConfiguration(id: string, data: ConfigurationUpdate) {
        const isConfigExist = await this.configurationRepository.findById(id);
        if (!isConfigExist) {
            throw new ApiError("Configuration not found", status.BAD_REQUEST);
        }

        const cleanData = removeUndefinedValues(data);
        await this.configurationRepository.update(id, cleanData);
    }

    public async deleteConfiguration(id: string) {
        const isConfigExist = await this.configurationRepository.findById(id);
        if (!isConfigExist) {
            throw new ApiError("Configuration not found", status.BAD_REQUEST);
        }

        await this.configurationRepository.delete(id);
    }

    // Configuration Detail methods
    public async createConfigurationDetail(data: any) {
        return await this.configurationDetailService.createConfigurationDetail(data);
    }

    public async updateConfigurationDetail(id: string, data: any) {
        return await this.configurationDetailService.updateConfigurationDetail(id, data);
    }

    public async deleteConfigurationDetail(id: string) {
        return await this.configurationDetailService.deleteConfigurationDetail(id);
    }
}

export default ConfigurationService;
