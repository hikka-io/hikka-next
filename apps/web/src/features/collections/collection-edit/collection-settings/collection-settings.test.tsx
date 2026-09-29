import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';

import { API_LIMITS } from '@hikka/api';

import CollectionProvider from '../collection-provider';
import type { CollectionState } from '../collection-store';
import CollectionEditSettings from './collection-settings';

vi.mock('@/utils/navigation', () => ({
    useRouter: () => ({ push: vi.fn() }),
    useParams: () => ({ reference: 'reference' }),
    Link: ({ children }: { children?: ReactNode }) => (
        <a href="/">{children}</a>
    ),
}));

const TITLE = API_LIMITS.collectionTitle;
const DESCRIPTION = API_LIMITS.collectionDescription;

const VALID = { title: 'Колекція', description: 'Опис колекції' };

const isSubmitDisabled = (
    mode: 'create' | 'edit',
    state: Partial<CollectionState>,
) => {
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(
        <QueryClientProvider client={new QueryClient()}>
            <CollectionProvider initialState={state}>
                <CollectionEditSettings mode={mode} />
            </CollectionProvider>
        </QueryClientProvider>,
    );

    const label = mode === 'create' ? 'Створити' : 'Оновити';
    const button = [
        ...container.querySelectorAll<HTMLButtonElement>('button'),
    ].find((element) => element.textContent?.includes(label));

    if (!button) throw new Error(`missing ${label} button`);

    return button.disabled;
};

describe.each(['create', 'edit'] as const)('%s collection settings', (mode) => {
    it.each([
        ['a regular title and description', VALID],
        [
            'the minimum lengths',
            {
                title: 'a'.repeat(TITLE.min),
                description: 'a'.repeat(DESCRIPTION.min),
            },
        ],
        [
            'the maximum lengths',
            {
                title: 'a'.repeat(TITLE.max),
                description: 'a'.repeat(DESCRIPTION.max),
            },
        ],
    ])('allows saving with %s', (_, state) => {
        expect(isSubmitDisabled(mode, state)).toBe(false);
    });

    it.each([
        ['no title', { ...VALID, title: undefined }],
        [
            'a title below the minimum',
            { ...VALID, title: 'a'.repeat(TITLE.min - 1) },
        ],
        [
            'a title over the maximum',
            { ...VALID, title: 'a'.repeat(TITLE.max + 1) },
        ],
        ['no description', { ...VALID, description: undefined }],
        [
            'a description below the minimum',
            { ...VALID, description: 'a'.repeat(DESCRIPTION.min - 1) },
        ],
        [
            'a description over the maximum',
            { ...VALID, description: 'a'.repeat(DESCRIPTION.max + 1) },
        ],
    ])('blocks saving with %s', (_, state) => {
        expect(isSubmitDisabled(mode, state)).toBe(true);
    });
});
