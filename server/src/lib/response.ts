import type { ErrorResponse, SuccessResponse } from "../types/index.js"

export const successResponse: SuccessResponse = {
    success: true,
    message: "Successfully completed the request",
    code: 200,
    data: {},
    error: {}
}

export const errorResponse: ErrorResponse = {
    success: false,
    message: "Something went wrong",
    code: 500,
    data: {},
    stack: {},
    error: {}
}