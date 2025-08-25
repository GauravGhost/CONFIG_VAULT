import type { User } from "@config-vault/shared";
import { SQLiteRepository } from "./base-repository/sqlite-repository.js";

class UserRepository extends SQLiteRepository<User> {
    constructor() {
        super("users");
    }
}

export default UserRepository;