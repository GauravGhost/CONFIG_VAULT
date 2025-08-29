import bcrypt from 'bcrypt';

import UserRepository from "../repository/user-repository";
import ApiError from "../utils/error";
import { removeUndefinedValues } from "../utils/type-helpers";
import { type ChangePassword, type User, type UserCreate, type UserUpdate } from "@config-vault/shared";
import status from 'http-status';

class UserService {
    private readonly userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    public async getUserByUsername(username: string): Promise<any> {
        const user = await this.userRepository.findOne({ username });
        return user;
    }

    public async createUser(data: UserCreate): Promise<any> {
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

    public async updateUser(id: string, data: UserUpdate): Promise<any> {
        const cleanData = removeUndefinedValues(data);

        if (cleanData.password) {
            cleanData.password = await this.encryptPassword(cleanData.password);
        }

        return this.userRepository.update(id, cleanData);
    }

    public async changePassword(id: string, data: ChangePassword) {
        const user = await this.getUserById(id);
        if (!user) {
            throw new ApiError('User not found', status.NOT_FOUND);
        }
        console.log(id, data);
        const isMatch = await bcrypt.compare(data.old_password, user.password);
        if (!isMatch) {
            throw new ApiError('Old password is incorrect', status.BAD_REQUEST);
        }
        user.password = await this.encryptPassword(data.new_password);
        return this.userRepository.update(id, user);
    }

    public async deleteUser(id: string): Promise<any> {
        return this.userRepository.delete(id);
    }
}

export default UserService;
