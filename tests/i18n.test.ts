import {describe, it} from 'node:test';
import assert from 'node:assert';
import {buildLocalizedPath} from '../src/utils/navigation';
import {normalizeLocale, DEFAULT_LOCALE} from '../src/i18n';
import {resolveErrorMessageKey} from '../src/utils/errorCodes';

describe('i18n helpers', () => {
    it('normalizes known locales', () => {
        assert.strictEqual(normalizeLocale('en-US'), 'en');
        assert.strictEqual(normalizeLocale('zh'), 'zh-CN');
        assert.strictEqual(normalizeLocale('ja'), 'ja-JP');
    });

    it('falls back to default locale when unknown', () => {
        assert.strictEqual(normalizeLocale('fr'), DEFAULT_LOCALE);
        assert.strictEqual(normalizeLocale(undefined), DEFAULT_LOCALE);
    });

    it('builds locale-aware paths without dropping search params', () => {
        const path = buildLocalizedPath({pathname: '/en/project/123', targetLocale: 'ja-JP', searchParams: 'q=test'});
        assert.strictEqual(path, '/ja-JP/project/123?q=test');
    });

    it('adds locale prefix when missing', () => {
        const path = buildLocalizedPath({pathname: '/submit', targetLocale: 'zh-CN'});
        assert.strictEqual(path, '/zh-CN/submit');
    });

    it('maps error codes to translation keys', () => {
        assert.strictEqual(resolveErrorMessageKey('PROJECT.NOT_FOUND'), 'error.project.notFound');
        assert.strictEqual(resolveErrorMessageKey('EVENT.CREATE_FAILED'), 'error.event.createFailed');
        assert.strictEqual(resolveErrorMessageKey('IDEA.LIST_FAILED'), 'error.idea.loadFailed');
        assert.strictEqual(resolveErrorMessageKey(), 'error.common.unknown');
    });
});
