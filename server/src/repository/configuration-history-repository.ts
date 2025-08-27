import type { ConfigurationHistory } from "@config-vault/shared";
import { SQLiteRepository } from "./base-repository/sqlite-repository.js";
import { TABLE_NAME } from "../utils/enums.js";

class ConfigurationHistoryRepository extends SQLiteRepository<ConfigurationHistory> {
    constructor() {
        super(TABLE_NAME.CONFIGURATION_HISTORY);
    }
}

export default ConfigurationHistoryRepository;