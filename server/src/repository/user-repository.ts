import type { User } from "@config-vault/shared";
import { SQLiteRepository } from "./base-repository/sqlite-repository";
import { TABLE_NAME } from "../utils/enums";

class UserRepository extends SQLiteRepository<User> {
    constructor() {
        super(TABLE_NAME.USERS);
    }
}

export default UserRepository;
