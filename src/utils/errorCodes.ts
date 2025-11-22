import {ApiErrorCode} from '@/types/api';

const ERROR_MESSAGE_KEYS: Record<ApiErrorCode, string> = {
    'COMMON.UNKNOWN': 'error.common.unknown',
    'COMMON.BAD_REQUEST': 'error.common.validation',
    'COMMON.VALIDATION_ERROR': 'error.common.validation',
    'COMMON.NOT_FOUND': 'error.common.unknown',
    'PROJECT.NOT_FOUND': 'error.project.notFound',
    'PROJECT.LIST_FAILED': 'error.project.loadFailed',
    'PROJECT.CREATE_FAILED': 'error.project.createFailed',
    'PROJECT.UPDATE_FAILED': 'error.project.updateFailed',
    'PROJECT.DELETE_FAILED': 'error.project.deleteFailed',
    'PROJECT.MISSING_AUTHOR': 'error.project.missingUser',
    'IDEA.NOT_FOUND': 'error.idea.notFound',
    'IDEA.LIST_FAILED': 'error.idea.loadFailed',
    'IDEA.CREATE_FAILED': 'error.idea.createFailed',
    'EVENT.NOT_FOUND': 'error.event.notFound',
    'EVENT.LIST_FAILED': 'error.event.loadFailed',
    'EVENT.CREATE_FAILED': 'error.event.createFailed',
    'EVENT.UPDATE_FAILED': 'error.event.updateFailed',
    'EVENT.DELETE_FAILED': 'error.event.deleteFailed',
};

export function resolveErrorMessageKey(code?: ApiErrorCode): string {
    if (!code) return 'error.common.unknown';
    return ERROR_MESSAGE_KEYS[code] ?? 'error.common.unknown';
}
