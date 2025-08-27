import type { UserSession } from "@config-vault/shared";
import { SQLiteRepository } from "./base-repository/sqlite-repository.js";
import { TABLE_NAME } from "../utils/enums.js";

class UserSessionRepository extends SQLiteRepository<UserSession> {
    constructor() {
        super(TABLE_NAME.USER_SESSIONS);
    }
}

export default UserSessionRepository;