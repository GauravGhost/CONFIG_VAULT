import type { Request, Response } from "express";
import ConfigurationService from "../services/configuration-service";
import ApiError from "../utils/error";
import status from "http-status";
import { successResponse } from "../lib/response";

class ConfigurationController {
    private readonly configurationService: ConfigurationService;

    constructor() {
        this.configurationService = new ConfigurationService();
    }

    public getConfigurationById = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        if(!id){
            throw new ApiError("Configuration ID is required", status.BAD_REQUEST);
        }
        const configuration = await this.configurationService.getConfigurationById(id);
        successResponse.data = configuration;
        successResponse.message = "Configuration fetched successfully";
        res.status(200).json(successResponse)
    }

    public getConfigurationsByProjectId = async (req: Request, res: Response): Promise<void> => {
        const { projectId } = req.params;
        if (!projectId) {
            throw new ApiError("Project ID is required", status.BAD_REQUEST);
        }
        const configurations = await this.configurationService.getConfigurationsByProjectId(projectId);
        successResponse.data = configurations;
        successResponse.message = "Configurations fetched successfully";
        res.status(200).json(successResponse);
    }

    public getConfigurationByProjectIdWithDetails = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        if (!id) {
            throw new ApiError("Configuration ID is required", status.BAD_REQUEST);
        }
        const configuration = await this.configurationService.getConfigurationsByProjectIdWithDetails(id);
        successResponse.data = configuration;
        successResponse.message = "Configuration fetched successfully";
        res.status(200).json(successResponse);
    }

    public createConfiguration = async (req: Request, res: Response): Promise<void> => {
        const configurationData = req.body;
        const newConfiguration = await this.configurationService.createConfiguration(configurationData);
        successResponse.data = newConfiguration;
        successResponse.message = "Configuration created successfully";
        res.status(status.CREATED).json(successResponse);
    }

    public updateConfiguration = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        if (!id) {
            throw new ApiError("Configuration ID is required", status.BAD_REQUEST);
        }
        const configurationData = req.body;
        const updatedConfiguration = await this.configurationService.updateConfiguration(id, configurationData);
        successResponse.data = updatedConfiguration;
        successResponse.message = "Configuration updated successfully";
        res.status(200).json(successResponse);
    }

    public deleteConfiguration = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        if (!id) {
            throw new ApiError("Configuration ID is required", status.BAD_REQUEST);
        }
        await this.configurationService.deleteConfiguration(id);
        successResponse.message = "Configuration deleted successfully";
        res.status(status.NO_CONTENT).json(successResponse);
    }

    // Configuration Detail methods
    public createConfigurationDetail = async (req: Request, res: Response): Promise<void> => {
        const detailData = req.body;
        const newDetail = await this.configurationService.createConfigurationDetail(detailData);
        successResponse.data = newDetail;
        successResponse.message = "Configuration detail created successfully";
        res.status(status.CREATED).json(successResponse);
    }

    public updateConfigurationDetail = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        if (!id) {
            throw new ApiError("Configuration detail ID is required", status.BAD_REQUEST);
        }
        const detailData = req.body;
        const updatedDetail = await this.configurationService.updateConfigurationDetail(id, detailData);
        successResponse.data = updatedDetail;
        successResponse.message = "Configuration detail updated successfully";
        res.status(200).json(successResponse);
    }

    public deleteConfigurationDetail = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        if (!id) {
            throw new ApiError("Configuration detail ID is required", status.BAD_REQUEST);
        }
        await this.configurationService.deleteConfigurationDetail(id);
        successResponse.message = "Configuration detail deleted successfully";
        res.status(status.NO_CONTENT).json(successResponse);
    }

}

export default ConfigurationController;