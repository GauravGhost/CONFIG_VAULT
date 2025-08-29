import type { Request, Response } from 'express';
import UserService from '../services/user-service.js';
import type { User, CreateItem, ChangePassword } from '@config-vault/shared';
import { successResponse } from '../lib/response.js';
import ApiError from '../utils/error.js';
import status from 'http-status';

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
            throw new ApiError("User ID is required", status.BAD_REQUEST);
        }

        const user = await this.userService.getUserById(id);

        const { password, ...userResponse } = user;
        successResponse.data = userResponse;
        res.status(200).json(successResponse);
    };

    public getProfile = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;

        if (!userId) {
            throw new ApiError("User not authenticated", status.UNAUTHORIZED);
        }

        const response = await this.userService.getUserById(userId);

        const { password, ...userResponse } = response;
        successResponse.data = userResponse;
        successResponse.message = 'Profile retrieved successfully';
        res.status(200).json(successResponse);
    };


    public updateUser = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const updateData: Partial<CreateItem<User>> = req.body;

        if (!id) {
            throw new ApiError("User ID is required", status.BAD_REQUEST);
        }

        const updatedUser = await this.userService.updateUser(id, updateData);

        if (!updatedUser) {
            throw new ApiError("User not found", status.NOT_FOUND);
        }

        const { password, ...userResponse } = updatedUser;

        successResponse.data = userResponse;
        res.status(200).json(successResponse);
    };


    public changePassword = async (req: Request, res: Response): Promise<void> => {
        const changePasswordData: ChangePassword = req.body;
        const userId = req.user?.id;

        if (!userId) {
            throw new ApiError("User not authenticated", status.UNAUTHORIZED);
        }

        await this.userService.changePassword(userId, changePasswordData);

        successResponse.message = 'Password changed successfully';
        res.status(200).json(successResponse);
    }

    public deleteUser = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;

        if (!id) {
            throw new ApiError("User ID is required", status.BAD_REQUEST);
        }

        await this.userService.deleteUser(id);

        successResponse.message = 'User deleted successfully';
        res.status(200).json(successResponse);
    };
}

export default UserController;