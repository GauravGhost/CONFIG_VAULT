import type { Project } from "@config-vault/shared";
import ProjectRepository from "../repository/project-repository.js";
import ApiError from "../utils/error.js";
import status from "http-status";

class ProjectService {
    private readonly projectRepository: ProjectRepository;

    constructor() {
        this.projectRepository = new ProjectRepository();
    }

    public async getAllProjects(): Promise<Project[]> {
        const projects = await this.projectRepository.findAll();
        return projects;
    }

    public async getProjectById(id: string): Promise<Project | null> {
        const project = await this.projectRepository.findById(id);
        return project;
    }

    public async createProject(data: Project): Promise<Project> {
        const project = await this.projectRepository.create(data);
        return project;
    }

    public async updateProject(id: string, data: Partial<Project>): Promise<Project> {
        const isProjectExist = await this.projectRepository.findById(id);
        if (!isProjectExist) {
            throw new ApiError("Project not found", status.NOT_FOUND);
        }

        const project = await this.projectRepository.update(id, data);
        return project;
    }

    public async deleteProject(id: string): Promise<void> {
        const isProjectExist = await this.projectRepository.findById(id);
        if (!isProjectExist) {
            throw new ApiError("Project not found", status.NOT_FOUND);
        }

        await this.projectRepository.delete(id);
    }
}

export default ProjectService;