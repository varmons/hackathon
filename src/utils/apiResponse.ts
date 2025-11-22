import {ApiErrorCode, ApiErrorResponse, ApiSuccessResponse} from '@/types/api';

export const successResponse = <T>(data: T): ApiSuccessResponse<T> => ({
    success: true,
    data,
});

export const errorResponse = (
    code: ApiErrorCode,
    message?: string,
    details?: unknown,
): ApiErrorResponse => ({
    success: false,
    error: {
        code,
        message,
        details,
    },
});
