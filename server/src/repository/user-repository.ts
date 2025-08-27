import type { User } from "@config-vault/shared";
import { SQLiteRepository } from "./base-repository/sqlite-repository.js";
import { TABLE_NAME } from "../utils/enums.js";

class UserRepository extends SQLiteRepository<User> {
    constructor() {
        super(TABLE_NAME.USERS);
    }
}

export default UserRepository;