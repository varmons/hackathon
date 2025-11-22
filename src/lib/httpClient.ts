import {ApiErrorCode, ApiErrorResponse, ApiResponse} from '@/types/api';

const DEFAULT_HEADERS: HeadersInit = {
    'Content-Type': 'application/json',
};

function toErrorResponse(code?: ApiErrorCode, message?: string): ApiErrorResponse {
    return {
        success: false,
        error: {
            code: code ?? 'COMMON.UNKNOWN',
            message,
        },
    };
}

async function request<T>(url: string, init?: RequestInit): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(url, {
            ...init,
            headers: {
                ...DEFAULT_HEADERS,
                ...(init?.headers ?? {}),
            },
        });

        const payload = await response.json().catch(() => undefined);

        if (!response.ok) {
            const code = payload?.error?.code as ApiErrorCode | undefined;
            const message = payload?.error?.message as string | undefined;
            return toErrorResponse(code, message);
        }

        if (payload?.success === false) {
            return payload as ApiErrorResponse;
        }

        if (payload?.data !== undefined) {
            return {
                success: true,
                data: payload.data as T,
            };
        }

        return {
            success: true,
            data: (payload ?? {}) as T,
        };
    } catch (error) {
        return toErrorResponse('COMMON.UNKNOWN', error instanceof Error ? error.message : undefined);
    }
}

export const httpClient = {
    get: <T>(url: string, init?: RequestInit) => request<T>(url, init),
    post: <T>(url: string, body: unknown, init?: RequestInit) =>
        request<T>(url, {
            ...init,
            method: 'POST',
            body: JSON.stringify(body),
        }),
    put: <T>(url: string, body: unknown, init?: RequestInit) =>
        request<T>(url, {
            ...init,
            method: 'PUT',
            body: JSON.stringify(body),
        }),
    delete: <T>(url: string, init?: RequestInit) =>
        request<T>(url, {
            ...init,
            method: 'DELETE',
        }),
};
