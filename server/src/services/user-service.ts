import bcrypt from 'bcrypt';

import UserRepository from "../repository/user-repository.js";
import ApiError from "../utils/error.js";
import type { User } from '@config-vault/shared';

class UserService {
    private readonly userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    public async getUserByUsername(username: string): Promise<any> {
        const user = await this.userRepository.findOne({ username });
        return user;
    }

    public async createUser(data: User): Promise<any> {
        data.password = await this.encryptPassword(data.password);
        return this.userRepository.create(data);
    }

    private async encryptPassword(password: string) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }

    public async getUserById(id: string): Promise<any> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new ApiError('User not found', 404);
        }
        return user;
    }

    public async updateUser(id: string, data: any): Promise<any> {
        return this.userRepository.update(id, data);
    }

    public async deleteUser(id: string): Promise<any> {
        return this.userRepository.delete(id);
    }
}

export default UserService;