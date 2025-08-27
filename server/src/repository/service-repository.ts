import type { Service } from "@config-vault/shared";
import { SQLiteRepository } from "./base-repository/sqlite-repository.js";
import { TABLE_NAME } from "../utils/enums.js";

class ServiceRepository extends SQLiteRepository<Service> {
    constructor() {
        super(TABLE_NAME.SERVICES);
    }
}

export default ServiceRepository;