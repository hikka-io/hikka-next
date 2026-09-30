import { isRedirect } from '@tanstack/react-router';
import { describe, expect, it } from 'vitest';

import { Route } from '../../routes/_pages/edit/new';

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

describe('new edit route guard', () => {
    it.each([{ content_type: 'anime' }, { slug: 'test-slug' }, {}])(
        'redirects to /edit from beforeLoad without both params (%o)',
        (search) => {
            expect(runBeforeLoad(search).redirect?.to).toBe('/edit');
        },
    );

    it('hands the target to the loader', () => {
        expect(
            runBeforeLoad({ content_type: 'anime', slug: 'test-slug' }),
        ).toEqual({
            context: { newEdit: { content_type: 'anime', slug: 'test-slug' } },
        });
    });
});
