import { getDefaultOptions } from 'date-fns';
import { expect, it } from 'vitest';

import { APP_LOCALE } from '@hikka/core';

it('applies the Ukrainian date locale when the app providers module is imported', async () => {
    await import('./providers');

    expect(getDefaultOptions().locale).toBe(APP_LOCALE);
});
