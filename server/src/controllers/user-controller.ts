import type { Request, Response } from 'express';
import UserService from '../services/user-service.js';
import type { User, CreateItem } from '@config-vault/shared';
import { successResponse } from '../lib/response.js';

class UserController {
    private readonly userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public createUser = async (req: Request, res: Response): Promise<void> => {
            const userData: CreateItem<User> = req.body;
            
            if (!userData.username || !userData.email || !userData.password) {
                res.status(400).json({
                    success: false,
                    message: 'Username, email, and password are required'
                });
                return;
            }

            const newUser = await this.userService.createUser(userData);
            
            const { password, ...userResponse } = newUser;

            successResponse.data = userResponse;
            res.status(201).json(successResponse);
    };

    public getUserById = async (req: Request, res: Response): Promise<void> => {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
                return;
            }

            const user = await this.userService.getUserById(id);

            const { password, ...userResponse } = user;
            successResponse.data = userResponse;
            res.status(200).json(successResponse);
    };

     public getProfile = async (req: Request, res: Response): Promise<void> => {
            const user = req.user;

            if (!user?.id) {
                res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
                return;
            }

            const response = await this.userService.getUserById(user.id);

            const { password, ...userResponse } = response;
            successResponse.data = userResponse;
            res.status(200).json(successResponse);
    };
    

    public updateUser = async (req: Request, res: Response): Promise<void> => {
            const { id } = req.params;
            const updateData: Partial<CreateItem<User>> = req.body;

            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
                return;
            }

            const updatedUser = await this.userService.updateUser(id, updateData);

            if (!updatedUser) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }

            const { password, ...userResponse } = updatedUser;

            successResponse.data = userResponse;
            res.status(200).json(successResponse);
    };

    public deleteUser = async (req: Request, res: Response): Promise<void> => {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
                return;
            }

            const result = await this.userService.deleteUser(id);

            if (!result) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }

            successResponse.message = 'User deleted successfully';
            res.status(200).json(successResponse);
    };
}

export default UserController;
