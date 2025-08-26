import bcrypt from 'bcrypt';
import UserService from './user-service.js';
import { generateAccessToken } from '../lib/jwt.js';
import ApiError from '../utils/error.js';
import status from 'http-status';
class AuthService {
    private readonly userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public async login({ username, password }: { username: string; password: string }): Promise<any> {
        const user = await this.userService.getUserByUsername(username);
        if (!user) {
            throw new ApiError('username or password is invalid', status.BAD_REQUEST);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ApiError('username or password is invalid', status.BAD_REQUEST);
        }
        const generateToken = await generateAccessToken(user);
        return { ...user, token: generateToken };
    }

    public async register({ username, password }: { username: string; password: string }): Promise<any> {
        const user = await this.userService.createUser({ username, password, email: "example@example.com" });
        const token = await generateAccessToken(user);
        return { ...user, token };
    }

}

export default AuthService;