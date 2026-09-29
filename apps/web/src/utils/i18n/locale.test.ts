import { format, getDefaultOptions, setDefaultOptions } from 'date-fns';
import { afterEach, describe, expect, it } from 'vitest';

import { APP_LOCALE, APP_LOCALE_TAG, applyDefaultLocale } from './locale';

const JULY_6 = new Date(2024, 6, 6);

afterEach(() => {
    setDefaultOptions({ locale: undefined });
});

describe('applyDefaultLocale', () => {
    it('makes locale-less date-fns calls format in Ukrainian', () => {
        expect(format(JULY_6, 'd MMMM')).toBe('6 July');

        applyDefaultLocale();

        expect(getDefaultOptions().locale).toBe(APP_LOCALE);
        expect(format(JULY_6, 'd MMMM')).toBe('6 липня');
        expect(format(JULY_6, 'd MMM yyyy')).toBe('6 лип. 2024');
    });

    it('is applied when the app providers module is imported', async () => {
        await import('@/features/app-shell/providers');

        expect(getDefaultOptions().locale).toBe(APP_LOCALE);
    });
});

describe('APP_LOCALE', () => {
    it('is the date-fns Ukrainian locale', () => {
        expect(APP_LOCALE.code).toBe('uk');
        expect(APP_LOCALE_TAG).toBe('uk-UA');
    });
});
