export type ApiErrorCode =
    | 'COMMON.UNKNOWN'
    | 'COMMON.VALIDATION_ERROR'
    | 'COMMON.BAD_REQUEST'
    | 'COMMON.NOT_FOUND'
    | 'PROJECT.NOT_FOUND'
    | 'PROJECT.LIST_FAILED'
    | 'PROJECT.CREATE_FAILED'
    | 'PROJECT.UPDATE_FAILED'
    | 'PROJECT.DELETE_FAILED'
    | 'PROJECT.MISSING_AUTHOR'
    | 'IDEA.NOT_FOUND'
    | 'IDEA.LIST_FAILED'
    | 'IDEA.CREATE_FAILED'
    | 'EVENT.NOT_FOUND'
    | 'EVENT.LIST_FAILED'
    | 'EVENT.CREATE_FAILED'
    | 'EVENT.UPDATE_FAILED'
    | 'EVENT.DELETE_FAILED';

export type ApiSuccessResponse<T> = {
    success: true;
    data: T;
};

export type ApiErrorResponse = {
    success: false;
    error: {
        code: ApiErrorCode;
        message?: string;
        details?: unknown;
    };
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
