import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import jwt from 'jsonwebtoken';

import type { User } from "@config-vault/shared";
import ApiError from "../utils/error.js";
import { SERVER_CONFIG } from "../config/server-config.js";
import UserService from "../services/user-service.js";

const verifyAuth = async (token: string) => {
    const userService = new UserService();
    let decoded;
    try {
        decoded = jwt.verify(token, SERVER_CONFIG.JWT_SECRET);
    } catch (error) {
        throw new ApiError("Invalid token", status.BAD_REQUEST);
    }

    if (typeof decoded === 'string') {
        throw new ApiError("Invalid token format", status.BAD_REQUEST);
    }

    const userId = decoded.userId;
    if (!userId) {
        throw new ApiError("User ID not found in token", status.BAD_REQUEST);
    }

    const user = await userService.getUserById(userId);
    if (!user) {
        throw new ApiError("User not found", status.BAD_REQUEST);
    }
    return user;
}

export const checkUserAuth = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization?.startsWith('Bearer')) {
        throw new ApiError("Token not found", status.UNAUTHORIZED);
    }
    const token = authorization.split(' ')[1];
    if (!token) {
        throw new ApiError("Invalid token format", status.UNAUTHORIZED);
    }
    const user = await verifyAuth(token);
    req.user = user;
    next();
}

export const generateAccessToken = async (user: User) => {
    const payload = {
        userId: user.id,
    }

    const token = jwt.sign(
        payload,
        SERVER_CONFIG.JWT_SECRET,
        { expiresIn: '1d' }
    )
    return token
}
