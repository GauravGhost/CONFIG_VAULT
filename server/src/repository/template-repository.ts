import type { Template } from "@config-vault/shared";
import { SQLiteRepository } from "./base-repository/sqlite-repository.js";
import { TABLE_NAME } from "../utils/enums.js";

class TemplateRepository extends SQLiteRepository<Template> {
    constructor() {
        super(TABLE_NAME.TEMPLATES);
    }
}

export default TemplateRepository;