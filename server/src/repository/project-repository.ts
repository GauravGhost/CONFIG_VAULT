import type { Project } from "@config-vault/shared";
import { SQLiteRepository } from "./base-repository/sqlite-repository.js";
import { TABLE_NAME } from "../utils/enums.js";

class ProjectRepository extends SQLiteRepository<Project> {
    constructor() {
        super(TABLE_NAME.PROJECTS);
    }
}

export default ProjectRepository;