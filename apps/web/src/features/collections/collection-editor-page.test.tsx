import type { ReactNode } from 'react';
import { renderToString } from 'react-dom/server';

import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';

import { type GetCollectionResponse, getCollectionOptions } from '@hikka/api';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { usePageHeader } from '@/features/app-shell';

import CollectionEditGroups from './collection-edit/collection-groups';
import CollectionProvider from './collection-edit/collection-provider';
import CollectionEditSettings from './collection-edit/collection-settings';
import type { CollectionState } from './collection-edit/collection-store';
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
    collection: [],
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

function LegacyCollectionUpdatePage({ reference }: { reference: string }) {
    const { data: collection } = useQuery(
        getCollectionOptions({ path: { reference } }),
    );

    usePageHeader({
        title: collection?.title,
        subtitle: 'Редагування',
        parent: `/collections/${reference}`,
    });

    if (!collection) return null;

    return (
        <CollectionProvider
            initialState={collection as Partial<CollectionState>}
        >
            <div>
                <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-x-10">
                    <Block>
                        <CollectionEditTitle />
                        <Card className="-mx-4 block w-auto rounded-none border-x-0 p-0 lg:hidden">
                            <CollectionEditSettings mode="edit" />
                        </Card>
                        <CollectionEditGroups mode="edit" />
                    </Block>
                    <Card className="sticky top-20 order-1 hidden w-full p-0 lg:order-2 lg:block">
                        <CollectionEditSettings mode="edit" />
                    </Card>
                </div>
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
    it('renders the new and update routes like the former route bodies', () => {
        const newPage = render(<CollectionEditorPage />, false);
        expect(newPage).toEqual(render(<LegacyCollectionNewPage />, false));
        expect(newPage.html).toContain('data-mode="default"');

        const updatePage = render(
            <CollectionEditorPage reference={REFERENCE} />,
            true,
        );
        expect(updatePage).toEqual(
            render(<LegacyCollectionUpdatePage reference={REFERENCE} />, true),
        );
        expect(updatePage.html).toContain('data-mode="edit"');
        expect(updatePage.html).toContain('Колекція');

        expect(
            render(<CollectionEditorPage reference={REFERENCE} />, false).html,
        ).toBe('');
    });
});
