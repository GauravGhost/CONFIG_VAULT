import type { ConfigurationShare } from "@config-vault/shared";
import { SQLiteRepository } from "./base-repository/sqlite-repository.js";
import { TABLE_NAME } from "../utils/enums.js";

class ConfigurationSharesRepository extends SQLiteRepository<ConfigurationShare> {
    constructor() {
        super(TABLE_NAME.CONFIGURATION_SHARES);
    }
}

export default ConfigurationSharesRepository;