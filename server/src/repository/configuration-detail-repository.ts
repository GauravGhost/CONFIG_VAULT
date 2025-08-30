import type { ConfigurationDetail } from "@config-vault/shared";
import { SQLiteRepository } from "./base-repository/sqlite-repository.js";
import { TABLE_NAME } from "../utils/enums.js";

class ConfigurationDetailRepository extends SQLiteRepository<ConfigurationDetail> {
    constructor() {
        super(TABLE_NAME.CONFIGURATION_DETAIL);
    }
}

export default ConfigurationDetailRepository;
