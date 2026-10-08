import { QueryClient } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
    getThemeCookieFn,
    getUiPrefsCookieFn,
    refreshAuthCookieFn,
} from '@/utils/cookies';

import { Route as RootRoute } from '../../routes/__root';

vi.mock('@/utils/cookies', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@/utils/cookies')>()),
    getThemeCookieFn: vi.fn(),
    getUiPrefsCookieFn: vi.fn(),
    refreshAuthCookieFn: vi.fn(),
}));

const runLoader = () =>
    (RootRoute.options.loader as (ctx: unknown) => Promise<unknown>)({
        context: { queryClient: new QueryClient() },
    });

afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetAllMocks();
});

describe('root loader', () => {
    it('starts every cookie server fn before any resolves on the server', () => {
        vi.stubGlobal('window', undefined);
        vi.mocked(getThemeCookieFn).mockReturnValue(new Promise(() => {}));

        runLoader();

        expect(refreshAuthCookieFn).toHaveBeenCalledTimes(1);
        expect(getThemeCookieFn).toHaveBeenCalledTimes(1);
        expect(getUiPrefsCookieFn).toHaveBeenCalledTimes(1);
    });

    it('does not refresh the auth cookie in the browser', async () => {
        await runLoader();

        expect(refreshAuthCookieFn).not.toHaveBeenCalled();
        expect(getThemeCookieFn).toHaveBeenCalledTimes(1);
    });
});
