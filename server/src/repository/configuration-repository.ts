import type { Configuration } from "@config-vault/shared";
import { SQLiteRepository } from "./base-repository/sqlite-repository.js";
import { TABLE_NAME } from "../utils/enums.js";

class ConfigurationRepository extends SQLiteRepository<Configuration> {
    constructor() {
        super(TABLE_NAME.CONFIGURATIONS);
    }
}

export default ConfigurationRepository;