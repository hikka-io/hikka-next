import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';

import { API_LIMITS } from '@hikka/api';

import ArticleProvider from '../../article-provider';
import type { ArticleState } from '../../article-store';
import CreateActions from './create-actions';
import EditActions from './edit-actions';

vi.mock('@/utils/navigation', () => ({
    useRouter: () => ({ push: vi.fn() }),
    Link: ({ children }: { children?: ReactNode }) => (
        <a href="/">{children}</a>
    ),
}));

const { min: MIN, max: MAX } = API_LIMITS.articleTitle;

const render = (actions: ReactNode, state: Partial<ArticleState>) => {
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(
        <QueryClientProvider client={new QueryClient()}>
            <ArticleProvider initialState={state}>{actions}</ArticleProvider>
        </QueryClientProvider>,
    );

    return [...container.querySelectorAll('button')].map(
        (button) => button.disabled,
    );
};

const VALID_TITLES = [
    ['the minimum length', 'a'.repeat(MIN)],
    ['the maximum length', 'a'.repeat(MAX)],
    ['padding around the minimum', `  ${'a'.repeat(MIN)}  `],
    ['a regular title', 'Стаття про аніме'],
] as const;

const INVALID_TITLES = [
    ['no title', undefined],
    ['an empty title', ''],
    ['a title below the minimum', 'a'.repeat(MIN - 1)],
    ['a short title padded with spaces', `  ${'a'.repeat(MIN - 1)}  `],
    ['a blank title', ' '.repeat(MIN + 2)],
    ['a title over the maximum', 'a'.repeat(MAX + 1)],
] as const;

const SCREENS = [
    ['create', () => <CreateActions />, {}, 2],
    ['edit a draft', () => <EditActions />, { slug: 'slug', draft: true }, 2],
    [
        'edit a published article',
        () => <EditActions />,
        { slug: 'slug', draft: false },
        1,
    ],
] as const;

describe.each(SCREENS)('%s actions', (_, actions, state, count) => {
    it.each(VALID_TITLES)('allows saving with %s', (_, title) => {
        const disabled = render(actions(), { ...state, title });

        expect(disabled).toHaveLength(count);
        expect(disabled.every((value) => !value)).toBe(true);
    });

    it.each(INVALID_TITLES)('blocks saving with %s', (_, title) => {
        const disabled = render(actions(), { ...state, title });

        expect(disabled).toHaveLength(count);
        expect(disabled.every(Boolean)).toBe(true);
    });
});
