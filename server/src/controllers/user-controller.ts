import type { Request, Response } from 'express';
import UserService from '../services/user-service.js';
import type { User, CreateItem } from '@config-vault/shared';

class UserController {
    private readonly userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    // Create a new user
    public createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userData: CreateItem<User> = req.body;
            
            // Basic validation
            if (!userData.username || !userData.email || !userData.password) {
                res.status(400).json({
                    success: false,
                    message: 'Username, email, and password are required'
                });
                return;
            }

            const newUser = await this.userService.createUser(userData);
            
            // Remove password from response
            const { password, ...userResponse } = newUser;
            
            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: userResponse
            });
        } catch (error: any) {
            console.error('Error creating user:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    };

    // Get user by ID
    public getUserById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
                return;
            }

            const user = await this.userService.getUserById(id);

            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }

            // Remove password from response
            const { password, ...userResponse } = user;

            res.status(200).json({
                success: true,
                message: 'User retrieved successfully',
                data: userResponse
            });
        } catch (error: any) {
            console.error('Error retrieving user:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    };

    // Update user
    public updateUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const updateData: Partial<CreateItem<User>> = req.body;

            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
                return;
            }

            // Remove sensitive fields that shouldn't be updated directly
            delete (updateData as any).id;
            delete (updateData as any).created_at;
            delete (updateData as any).updated_at;

            const updatedUser = await this.userService.updateUser(id, updateData);

            if (!updatedUser) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }

            // Remove password from response
            const { password, ...userResponse } = updatedUser;

            res.status(200).json({
                success: true,
                message: 'User updated successfully',
                data: userResponse
            });
        } catch (error: any) {
            console.error('Error updating user:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    };

    // Delete user
    public deleteUser = async (req: Request, res: Response): Promise<void> => {
        try {
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

            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error: any) {
            console.error('Error deleting user:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    };
}

export default UserController;
