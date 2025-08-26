import type { Request, Response } from 'express';
import type { User, CreateItem } from '@config-vault/shared';
import { successResponse } from '../lib/response.js';
import AuthService from '../services/auth-service.js';

class AuthController {
    private readonly authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public login = async (req: Request, res: Response): Promise<void> => {
        const { username, password } = req.body;
        const login = await this.authService.login({ username, password });

            successResponse.data = login;
            res.status(200).json(successResponse);
    };

    public register = async (req: Request, res: Response): Promise<void> => {
        const userData: CreateItem<User> = req.body;

        if (!userData.username || !userData.email || !userData.password) {
            res.status(400).json({
                success: false,
                message: 'Username, email, and password are required'
            });
            return;
        }

        const newUser = await this.authService.register(userData);

        const { password, ...userResponse } = newUser;

        successResponse.data = userResponse;
        res.status(201).json(successResponse);
    };
}

export default AuthController;
