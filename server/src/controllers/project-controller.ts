import status from "http-status";
import ProjectService from "../services/project-service.js";
import ApiError from "../utils/error.js";
import { successResponse } from "../lib/response.js";
import type { Request, Response } from "express";

class ProjectController {
    private readonly projectService: ProjectService;

    constructor() {
        this.projectService = new ProjectService();
    }

    public getAllProjects = async (req: Request, res: Response): Promise<void> => {
        const projects = await this.projectService.getAllProjects();

        successResponse.data = projects;
        res.status(200).json(successResponse);
    }

    public getProjectById = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        if (!id) {
            throw new ApiError("Project ID is required", status.BAD_REQUEST);
        }
        const project = await this.projectService.getProjectById(id);

        successResponse.data = project;
        res.status(200).json(successResponse);
    }

    public createProject = async (req: Request, res: Response): Promise<void> => {
        const projectData = req.body;
        const user = req.user;
        if(!user){
            throw new ApiError("User not found", status.UNAUTHORIZED);
        }
        if (!projectData.name || !projectData.description) {
            throw new ApiError("Project name and description are required", status.BAD_REQUEST);
        }

        const newProject = await this.projectService.createProject(projectData, user);

        successResponse.data = newProject;
        res.status(201).json(successResponse);
    }

    public updateProject = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const updateData = req.body;

        if (!id) {
            throw new ApiError("Project ID is required", status.BAD_REQUEST);
        }

        const updatedProject = await this.projectService.updateProject(id, updateData);

        successResponse.data = updatedProject;
        res.status(200).json(successResponse);
    }

    public deleteProject = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;

        if (!id) {
            throw new ApiError("Project ID is required", status.BAD_REQUEST);
        }

        await this.projectService.deleteProject(id);

        successResponse.message = 'Project deleted successfully';
        res.status(200).json(successResponse);
    }
}

export default ProjectController;