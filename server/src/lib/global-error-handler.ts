import type { NextFunction, Request, Response } from "express";
import ApiError from "../utils/error.js";
import { SERVER_CONFIG } from "../config/server-config.js";

const errorHandler = (err: ApiError | Error, _req: Request, res: Response, _next: NextFunction) => {
    let statusCode = 500;
    let message = err.message;

    // Check if it's an ApiError instance or has statusCode property
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
    } else if ('statusCode' in err && typeof (err as any).statusCode === 'number') {
        statusCode = (err as any).statusCode;
    }
    
    res.locals.errorMessage = err.message;
    
    // Create a fresh error response object for each request to avoid mutation
    const response = {
        success: false,
        message: message,
        code: statusCode,
        data: {},
        error: err.message,
        stack: SERVER_CONFIG.NODE_ENV === "development" ? err.stack : undefined
    };

    if (SERVER_CONFIG.NODE_ENV === "development") {
        console.error(err);
    }
    
    console.log('Error response:', response);
    res.status(statusCode).json(response);
};

export default {
    errorHandler
};