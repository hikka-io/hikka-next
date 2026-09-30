import { act } from 'react';
import { createRoot } from 'react-dom/client';

import {
    hashKey,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
    ContentTypeEnum,
    configureBrowserClient,
    type MainContentTypeEnum,
} from '@hikka/api';

import { contentInfoOptions } from '@/utils/api/content-queries';

import { animeStaffOptions } from './queries';
import ContentStaff from './staff';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

configureBrowserClient({ baseUrl: 'https://api.example.test' });

const SLUG = 'some-slug';

vi.mock('@/utils/navigation', () => ({
    useParams: () => ({ slug: SLUG }),
}));

vi.mock('@/services/hooks/use-visible-once', () => ({
    useVisibleOnce: () => ({ ref: () => {}, visible: true }),
}));

vi.mock('@/components/content-card/person-card', () => ({
    default: ({ person }: { person: { slug: string } }) => (
        <span data-person={person.slug} />
    ),
}));

vi.mock('@/components/ui/header', () => ({
    Header: ({ children }: { children: React.ReactNode }) => children,
    HeaderContainer: ({ children }: { children: React.ReactNode }) => children,
    HeaderNavButton: () => null,
    HeaderTitle: ({ children }: { children: React.ReactNode }) => children,
}));

const staff = (slug: string) => ({ person: { slug }, roles: [] });

const teardown: (() => void)[] = [];

afterEach(() => {
    for (const dispose of teardown.splice(0)) act(() => dispose());
    vi.unstubAllGlobals();
});

async function render(queryClient: QueryClient, type: MainContentTypeEnum) {
    const container = document.createElement('div');
    const root = createRoot(container);

    await act(async () =>
        root.render(
            <QueryClientProvider client={queryClient}>
                <ContentStaff content_type={type} extended />
            </QueryClientProvider>,
        ),
    );
    await act(() => new Promise((resolve) => setTimeout(resolve, 10)));
    teardown.push(() => root.unmount());

    return container;
}

const newQueryClient = () =>
    new QueryClient({ defaultOptions: { queries: { staleTime: Infinity } } });

const people = (container: HTMLElement) =>
    [...container.querySelectorAll('[data-person]')].map((node) =>
        node.getAttribute('data-person'),
    );

describe('ContentStaff', () => {
    it('lists the anime staff pages through one observer', async () => {
        const key = animeStaffOptions(SLUG).queryKey;
        const queryClient = newQueryClient();
        queryClient.setQueryData(key, {
            pages: [
                {
                    list: [staff('a'), staff('b')],
                    pagination: { page: 1, pages: 1, total: 2 },
                },
            ],
            pageParams: [1],
        } as never);

        const container = await render(queryClient, ContentTypeEnum.ANIME);

        expect(people(container)).toEqual(['a', 'b']);
        const queries = queryClient.getQueryCache().getAll();
        expect(queries.map((query) => query.queryHash)).toEqual([hashKey(key)]);
        expect(queries[0].getObserversCount()).toBe(1);
    });

    it.each([ContentTypeEnum.MANGA, ContentTypeEnum.NOVEL] as const)(
        'lists the %s authors from the info query through one observer',
        async (type) => {
            const key = contentInfoOptions(type, SLUG).queryKey;
            const queryClient = newQueryClient();
            queryClient.setQueryData(key, {
                authors: [staff('x'), staff('y')],
            } as never);

            const container = await render(queryClient, type);

            expect(people(container)).toEqual(['x', 'y']);
            const queries = queryClient.getQueryCache().getAll();
            expect(queries.map((query) => query.queryHash)).toEqual([
                hashKey(key),
            ]);
            expect(queries[0].getObserversCount()).toBe(1);
        },
    );
});
