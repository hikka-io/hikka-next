import { isRedirect } from '@tanstack/react-router';
import { describe, expect, it } from 'vitest';

import { Route } from '../../routes/_pages/oauth';

type BeforeLoad = (ctx: { search: object }) => unknown;

function runBeforeLoad(search: object) {
    const beforeLoad = Route.options.beforeLoad as BeforeLoad | undefined;
    try {
        return { context: beforeLoad?.({ search }) };
    } catch (error) {
        if (isRedirect(error)) return { redirect: error.options };
        throw error;
    }
}

describe('oauth route guard', () => {
    it.each([{ reference: 'client-ref' }, { scope: 'read:user' }, {}])(
        'redirects home from beforeLoad without both params (%o)',
        (search) => {
            expect(runBeforeLoad(search).redirect?.to).toBe('/');
        },
    );

    it('hands the client reference to the loader', () => {
        expect(
            runBeforeLoad({ reference: 'client-ref', scope: 'read:user' }),
        ).toEqual({ context: { clientReference: 'client-ref' } });
    });
});

describe('oauth loader deps', () => {
    it('keys the loader on the client reference only', () => {
        const loaderDeps = Route.options.loaderDeps as (ctx: {
            search: object;
        }) => unknown;

        expect(
            loaderDeps({
                search: { reference: 'client-ref', scope: 'read:user' },
            }),
        ).toEqual({ reference: 'client-ref' });
    });
});
