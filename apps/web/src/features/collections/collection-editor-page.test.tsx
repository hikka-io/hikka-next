import type { ReactNode } from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';

import { type GetCollectionResponse, getCollectionOptions } from '@hikka/api';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { usePageHeader } from '@/features/app-shell';

import CollectionEditGroups from './collection-edit/collection-groups';
import CollectionProvider from './collection-edit/collection-provider';
import CollectionEditSettings from './collection-edit/collection-settings';
import CollectionEditTitle from './collection-edit/collection-title';
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

function LegacyCollectionNewPage() {
    usePageHeader({
        title: 'Нова колекція',
        parent: '/collections',
    });

    return (
        <CollectionProvider>
            <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-x-10">
                <Block>
                    <CollectionEditTitle />
                    <Card className="-mx-4 block w-auto rounded-none border-x-0 p-0 lg:hidden">
                        <CollectionEditSettings />
                    </Card>
                    <CollectionEditGroups />
                </Block>
                <Card className="sticky top-20 order-1 hidden w-full p-0 lg:order-2 lg:block">
                    <CollectionEditSettings />
                </Card>
            </div>
        </CollectionProvider>
    );
}

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
    it('renders the new route like the former route body and the update route in edit mode', () => {
        const newPage = render(<CollectionEditorPage />, false);
        expect(newPage).toEqual(render(<LegacyCollectionNewPage />, false));
        expect(newPage.html).toContain('data-mode="default"');

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
        expect(
            updatePage.html.match(/data-stub="settings" data-mode="edit"/g),
        ).toHaveLength(2);
        expect(updatePage.html).toContain('data-stub="groups"');

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
});
