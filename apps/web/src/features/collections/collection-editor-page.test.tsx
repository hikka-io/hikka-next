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
import { contentInfoOptions } from '@/utils/api/content-queries';
import {
    applyQueryDefaults,
    QUERY_CLIENT_DEFAULTS,
} from '@/utils/api/query-defaults';

import CollectionEditorPage from './collection-editor-page';

vi.mock('@/features/app-shell', () => ({ usePageHeader: vi.fn() }));
vi.mock('@/services/hooks/use-prevent-unsaved-close', () => ({
    usePreventUnsavedClose: () => ({ status: 'idle' }),
}));
vi.mock('@/services/session', () => ({
    useSession: () => ({ user: { username: 'author', avatar: '' } }),
}));
vi.mock('@/utils/navigation', () => ({
    useRouter: () => ({ replace: vi.fn() }),
}));

const { stub } = vi.hoisted(() => ({
    stub: (name: string) => ({
        default: ({ className }: { className?: string }) => (
            <div data-stub={name} data-class={className ?? ''} />
        ),
    }),
}));

vi.mock('@/components/rules-alert', () => stub('rules'));
vi.mock('@/components/unsaved-changes-dialog', () => stub('leave'));
vi.mock('./collection-edit/collection-editor-author', () => stub('author'));
vi.mock('./collection-edit/collection-description', () => stub('description'));
vi.mock('./collection-edit/groups/collection-groups', () => stub('groups'));
vi.mock('./collection-edit/publish/publish-card', () => stub('publish'));
vi.mock('./collection-edit/publish/publish-drawer', () => stub('drawer'));
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
    author: { username: 'author', avatar: '' },
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

const readState = (html: string) =>
    JSON.parse(
        new DOMParser().parseFromString(html, 'text/html').querySelector('pre')
            ?.textContent ?? '',
    );

const parts = (html: string) =>
    [...html.matchAll(/<pre>|data-stub="(\w+)" data-class="([^"]*)"/g)].map(
        ([, name, className]) =>
            name ? `${name}${className ? `.${className}` : ''}` : 'title',
    );

describe('CollectionEditorPage', () => {
    it('lays the editor out like the collection page, settings to the side', () => {
        const { html } = render(
            <CollectionEditorPage reference={REFERENCE} />,
            true,
        );

        expect(parts(html)).toEqual([
            'rules.md:hidden',
            'author',
            'title',
            'description',
            'groups',
            'publish',
            'rules',
            'drawer',
            'leave',
        ]);
    });

    it('titles the header with the collection and its save status', () => {
        const update = render(
            <CollectionEditorPage reference={REFERENCE} />,
            true,
        );
        expect(update.header).toEqual([
            [
                {
                    title: 'Колекція',
                    subtitle: 'Збережено',
                    parent: `/collections/${REFERENCE}`,
                    actionsComponent: expect.any(Function),
                },
            ],
        ]);

        const created = render(<CollectionEditorPage />, false);
        expect(created.header).toEqual([
            [
                {
                    title: 'Нова колекція',
                    subtitle: 'Нова колекція',
                    parent: '/collections',
                    actionsComponent: expect.any(Function),
                },
            ],
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

        expect(readState(html)).toEqual({
            reference: REFERENCE,
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
            save: { status: 'idle', dirty: false },
        });
    });

    it('starts a new collection with the title it was opened from', () => {
        const queryClient = new QueryClient();
        queryClient.setQueryData(
            contentInfoOptions('anime', 'frieren').queryKey,
            { slug: 'frieren', title_ua: 'Фрірен' } as never,
        );
        const html = renderToString(
            <QueryClientProvider client={queryClient}>
                <CollectionEditorPage
                    initialContent={{ content_type: 'anime', slug: 'frieren' }}
                />
            </QueryClientProvider>,
        );
        const state = readState(html);

        expect(state.reference).toBeUndefined();
        expect(state.content_type).toBe('anime');
        expect(state.groups).toEqual([
            {
                title: null,
                items: [{ content: { slug: 'frieren', title_ua: 'Фрірен' } }],
            },
        ]);
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
