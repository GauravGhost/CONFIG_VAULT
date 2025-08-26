export interface BaseResponse {
    success: boolean;
    message: string;
    code: number;
}

export interface SuccessResponse<T = any> extends BaseResponse {
    success: true;
    data: T;
    error: {};
}

export interface ErrorResponse extends BaseResponse {
    success: false;
    data: {};
    stack?: any;
    error: any;
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;
