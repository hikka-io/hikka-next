import type { ReactNode } from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import {
    focusManager,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';

import { type GetCollectionResponse, getCollectionOptions } from '@hikka/api';

import { usePageHeader } from '@/features/app-shell';
import {
    applyQueryDefaults,
    QUERY_CLIENT_DEFAULTS,
} from '@/utils/api/query-defaults';

import CollectionEditorPage from './collection-editor-page';

vi.mock('@/features/app-shell', () => ({ usePageHeader: vi.fn() }));
vi.mock('./collection-edit/collection-groups', () => ({
    default: ({ mode }: { mode?: string }) => (
        <div data-stub="groups" data-mode={mode ?? 'default'} />
    ),
}));
vi.mock('./collection-edit/collection-settings', () => ({
    default: ({ mode }: { mode?: string }) => (
        <div data-stub="settings" data-mode={mode ?? 'default'} />
    ),
}));
vi.mock('./collection-edit/collection-title', async () => {
    const { useCollectionContext } = await import(
        './collection-edit/collection-provider'
    );
    return {
        default: () => {
            const state = useCollectionContext((store) => store);
            return (
                <pre>
                    {JSON.stringify(state, (key, value) =>
                        key === 'id' ? undefined : value,
                    )}
                </pre>
            );
        },
    };
});

const REFERENCE = 'a1b2c3d4-0000-0000-0000-000000000000';

const COLLECTION = {
    reference: REFERENCE,
    title: 'Колекція',
    description: 'Опис',
    content_type: 'manga',
    nsfw: true,
    spoiler: false,
    visibility: 'public',
    tags: ['a'],
    collection: [
        { comment: 'коментар', label: 'Група', content: { slug: 'a' } },
        { comment: null, label: 'Група', content: { slug: 'b' } },
    ],
} as unknown as GetCollectionResponse;

const render = (node: ReactNode, cached: boolean) => {
    const queryClient = new QueryClient();
    if (cached) {
        queryClient.setQueryData(
            getCollectionOptions({ path: { reference: REFERENCE } }).queryKey,
            COLLECTION,
        );
    }
    vi.mocked(usePageHeader).mockClear();
    const html = renderToString(
        <QueryClientProvider client={queryClient}>{node}</QueryClientProvider>,
    );
    return { html, header: [...vi.mocked(usePageHeader).mock.calls] };
};

describe('CollectionEditorPage', () => {
    const stubs = (html: string) =>
        [...html.matchAll(/<pre>|data-stub="(\w+)" data-mode="(\w+)"/g)].map(
            ([, stub, mode]) => (stub ? `${stub}:${mode}` : 'title'),
        );

    it('renders one settings panel between the title and the groups', () => {
        const newPage = render(<CollectionEditorPage />, false);
        expect(newPage.header).toEqual([
            [{ title: 'Нова колекція', parent: '/collections' }],
        ]);
        expect(stubs(newPage.html)).toEqual([
            'title',
            'settings:default',
            'groups:default',
        ]);

        const updatePage = render(
            <CollectionEditorPage reference={REFERENCE} />,
            true,
        );
        expect(updatePage.header).toEqual([
            [
                {
                    title: 'Колекція',
                    subtitle: 'Редагування',
                    parent: `/collections/${REFERENCE}`,
                },
            ],
        ]);
        expect(stubs(updatePage.html)).toEqual([
            'title',
            'settings:edit',
            'groups:default',
        ]);

        expect(
            render(<CollectionEditorPage reference={REFERENCE} />, false).html,
        ).toBe('');
    });

    it('starts the editor store from the loaded collection', () => {
        const { html } = render(
            <CollectionEditorPage reference={REFERENCE} />,
            true,
        );
        const state = JSON.parse(
            new DOMParser()
                .parseFromString(html, 'text/html')
                .querySelector('pre')?.textContent ?? '',
        );

        expect(state).toEqual({
            title: 'Колекція',
            description: 'Опис',
            content_type: 'manga',
            groups: [
                {
                    title: 'Група',
                    items: [
                        { content: { slug: 'a' }, comment: 'коментар' },
                        { content: { slug: 'b' } },
                    ],
                },
            ],
            nsfw: true,
            spoiler: false,
            visibility: 'public',
            tags: ['a'],
        });
    });

    it('starts a fresh store when the route switches to another collection', async () => {
        const OTHER = 'ffffffff-0000-0000-0000-000000000000';
        const queryClient = new QueryClient();
        queryClient.setQueryData(
            getCollectionOptions({ path: { reference: REFERENCE } }).queryKey,
            COLLECTION,
        );
        queryClient.setQueryData(
            getCollectionOptions({ path: { reference: OTHER } }).queryKey,
            { ...COLLECTION, reference: OTHER, title: 'Інша колекція' },
        );
        const container = document.createElement('div');
        const root = createRoot(container);
        const show = (reference: string) =>
            act(async () => {
                root.render(
                    <QueryClientProvider client={queryClient}>
                        <CollectionEditorPage reference={reference} />
                    </QueryClientProvider>,
                );
            });

        vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
        try {
            await show(REFERENCE);
            expect(container.querySelector('pre')?.textContent).toContain(
                '"title":"Колекція"',
            );

            await show(OTHER);
            expect(container.querySelector('pre')?.textContent).toContain(
                '"title":"Інша колекція"',
            );
        } finally {
            await act(async () => root.unmount());
            vi.unstubAllGlobals();
        }
    });

    it('does not refetch the collection being edited on window focus', async () => {
        const queryClient = new QueryClient({
            defaultOptions: { queries: QUERY_CLIENT_DEFAULTS },
        });
        applyQueryDefaults(queryClient);
        const { queryKey } = getCollectionOptions({
            path: { reference: REFERENCE },
        });
        queryClient.setQueryData(queryKey, COLLECTION);
        await queryClient.invalidateQueries({ queryKey, refetchType: 'none' });
        const container = document.createElement('div');
        const root = createRoot(container);

        const fetches = vi.fn();
        queryClient.getQueryCache().subscribe((event) => {
            if (event.type === 'updated' && event.action.type === 'fetch') {
                fetches();
            }
        });
        vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
        focusManager.setFocused(false);
        try {
            await act(async () => {
                root.render(
                    <QueryClientProvider client={queryClient}>
                        <CollectionEditorPage reference={REFERENCE} />
                    </QueryClientProvider>,
                );
            });
            fetches.mockClear();
            await act(async () => {
                focusManager.setFocused(true);
                await new Promise((resolve) => setTimeout(resolve, 0));
            });

            expect(fetches).not.toHaveBeenCalled();
        } finally {
            focusManager.setFocused(undefined);
            await act(async () => root.unmount());
            vi.unstubAllGlobals();
        }
    });
});
