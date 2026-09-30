import { act, type FC } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ContentTypeEnum } from '@hikka/api';

import {
    type ContentInfoType,
    contentInfoOptions,
} from '@/utils/api/content-queries';

import { Route as AnimeRoute } from '../../routes/_pages/anime/$slug';
import { Route as CharacterRoute } from '../../routes/_pages/characters/$slug';
import { Route as MangaRoute } from '../../routes/_pages/manga/$slug';
import { Route as NovelRoute } from '../../routes/_pages/novel/$slug';
import { Route as PersonRoute } from '../../routes/_pages/people/$slug';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@tanstack/react-router', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@tanstack/react-router')>()),
    Outlet: () => null,
}));

vi.mock('@/features/content', () => ({
    ContentDetailLayout: ({
        slug,
        title,
        nsfw,
        nsfwConsented,
    }: {
        slug: string;
        title: string;
        nsfw?: boolean;
        nsfwConsented?: boolean;
    }) => (
        <p>
            {[slug, title, nsfw ? 'nsfw' : 'sfw', nsfwConsented ? 'ok' : '-']
                .filter(Boolean)
                .join('|')}
        </p>
    ),
}));

vi.mock('@/services/session', () => ({
    useTitle: (item?: { name_ua?: string }) => item?.name_ua ?? '',
}));

const SLUG = 'frieren';

type LayoutRoute = {
    options: { component?: unknown };
    useParams: () => unknown;
    useLoaderData: () => unknown;
};

type Case = {
    name: string;
    route: LayoutRoute;
    type: ContentInfoType;
    field: string;
    nsfwConsented?: boolean;
};

const CASES: Case[] = [
    {
        name: 'anime',
        route: AnimeRoute,
        type: ContentTypeEnum.ANIME,
        field: 'title_ua',
        nsfwConsented: true,
    },
    {
        name: 'manga',
        route: MangaRoute,
        type: ContentTypeEnum.MANGA,
        field: 'title_ua',
        nsfwConsented: true,
    },
    {
        name: 'novel',
        route: NovelRoute,
        type: ContentTypeEnum.NOVEL,
        field: 'title_ua',
        nsfwConsented: true,
    },
    {
        name: 'character',
        route: CharacterRoute,
        type: ContentTypeEnum.CHARACTER,
        field: 'name_ua',
    },
    {
        name: 'person',
        route: PersonRoute,
        type: ContentTypeEnum.PERSON,
        field: 'name_ua',
    },
];

const entity = ({ field }: Case, title: string, nsfw = false) => ({
    slug: SLUG,
    [field]: title,
    nsfw,
});

function setup(testCase: Case) {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: Infinity, gcTime: Infinity } },
    });
    const { queryKey } = contentInfoOptions(testCase.type, SLUG);
    const snapshot = entity(testCase, 'Old');

    queryClient.setQueryData(queryKey, snapshot as never);
    vi.spyOn(testCase.route, 'useParams').mockReturnValue({
        slug: SLUG,
    } as never);
    vi.spyOn(testCase.route, 'useLoaderData').mockReturnValue({
        [testCase.name]: snapshot,
        ...(testCase.nsfwConsented === undefined
            ? {}
            : { nsfwConsented: testCase.nsfwConsented }),
    } as never);

    const Layout = testCase.route.options.component as FC;
    const tree = (
        <QueryClientProvider client={queryClient}>
            <Layout />
        </QueryClientProvider>
    );

    return { queryClient, queryKey, tree };
}

afterEach(() => {
    vi.restoreAllMocks();
});

describe.each(CASES)('$name detail layout', (testCase) => {
    const consent = testCase.nsfwConsented ? 'ok' : '-';
    const nsfwAfter = testCase.nsfwConsented === undefined ? 'sfw' : 'nsfw';

    it('server-renders the cached entity', () => {
        const { tree } = setup(testCase);

        expect(renderToString(tree)).toContain(`${SLUG}|Old|sfw|${consent}`);
    });

    it('re-renders when the cached entity changes', async () => {
        const { queryClient, queryKey, tree } = setup(testCase);
        const container = document.createElement('div');
        const root = createRoot(container);

        act(() => root.render(tree));
        expect(container.textContent).toBe(`${SLUG}|Old|sfw|${consent}`);

        await act(async () => {
            queryClient.setQueryData(
                queryKey,
                entity(testCase, 'New', true) as never,
            );
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(container.textContent).toBe(
            `${SLUG}|New|${nsfwAfter}|${consent}`,
        );
        act(() => root.unmount());
    });
});
