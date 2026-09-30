import { act } from 'react';
import { createRoot } from 'react-dom/client';

import {
    hashKey,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ContentTypeEnum, configureBrowserClient } from '@hikka/api';

import {
    type ContentInfoType,
    contentInfoOptions,
} from '@/utils/api/content-queries';

import { useContent } from './use-content';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

configureBrowserClient({ baseUrl: 'https://api.example.test' });

vi.mock('@/services/session', () => ({
    useSessionUI: () => ({
        preferences: { title_language: 'title_en', name_language: 'name_en' },
    }),
}));

type Result = ReturnType<typeof useContent>;

const CASES = {
    [ContentTypeEnum.ANIME]: {
        slug: 'frieren',
        data: { title_ua: 'Фрірен', title_en: 'Frieren', image: 'anime.jpg' },
        title: 'Frieren',
        image: 'anime.jpg',
    },
    [ContentTypeEnum.MANGA]: {
        slug: 'berserk',
        data: { title_ua: 'Берсерк', title_en: 'Berserk', image: 'manga.jpg' },
        title: 'Berserk',
        image: 'manga.jpg',
    },
    [ContentTypeEnum.NOVEL]: {
        slug: 'tgcf',
        data: { title_ua: 'Благословення', title_en: 'TGCF', image: 'n.jpg' },
        title: 'TGCF',
        image: 'n.jpg',
    },
    [ContentTypeEnum.CHARACTER]: {
        slug: 'lelouch',
        data: { name_ua: 'Лелуш', name_en: 'Lelouch', image: 'c.jpg' },
        title: 'Lelouch',
        image: 'c.jpg',
    },
    [ContentTypeEnum.PERSON]: {
        slug: 'kamiya',
        data: { name_ua: 'Каміа', name_en: 'Kamiya', image: 'p.jpg' },
        title: 'Kamiya',
        image: 'p.jpg',
    },
    [ContentTypeEnum.COLLECTION]: {
        slug: 'a4df4cf1-3190-4e5e-9824-b739eb976d5a',
        data: {
            title: 'Колекція',
            collection: [{ content: { image: 'first.jpg' } }],
        },
        title: 'Колекція',
        image: 'first.jpg',
    },
    [ContentTypeEnum.EDIT]: {
        slug: '42',
        data: { edit_id: 42, content: { image: 'edited.jpg' } },
        title: 'Правка #42',
        image: 'edited.jpg',
    },
    [ContentTypeEnum.ARTICLE]: {
        slug: 'news',
        data: { title: 'Новина', image: 'ignored.jpg' },
        title: 'Новина',
        image: null,
    },
    [ContentTypeEnum.USER]: {
        slug: 'tester',
        data: { username: 'tester', avatar: 'avatar.jpg' },
        title: 'tester',
        image: 'avatar.jpg',
    },
} satisfies Record<ContentInfoType, unknown>;

const TYPES = Object.keys(CASES) as (keyof typeof CASES)[];

const teardown: (() => void)[] = [];

afterEach(() => {
    for (const dispose of teardown.splice(0)) act(() => dispose());
    vi.unstubAllGlobals();
});

function Probe({
    type,
    slug,
    onRender,
}: {
    type: keyof typeof CASES;
    slug: string;
    onRender: (result: Result) => void;
}) {
    onRender(useContent({ content_type: type, slug }));
    return null;
}

async function mount(queryClient: QueryClient, type: keyof typeof CASES) {
    const container = document.createElement('div');
    const root = createRoot(container);
    const result: { current?: Result } = {};

    await act(async () =>
        root.render(
            <QueryClientProvider client={queryClient}>
                <Probe
                    type={type}
                    slug={CASES[type].slug}
                    onRender={(value) => {
                        result.current = value;
                    }}
                />
            </QueryClientProvider>,
        ),
    );
    await act(() => new Promise((resolve) => setTimeout(resolve, 10)));
    teardown.push(() => root.unmount());

    return result;
}

const newQueryClient = () =>
    new QueryClient({ defaultOptions: { queries: { staleTime: Infinity } } });

describe.each(TYPES)('useContent(%s)', (type) => {
    const { slug, data, title, image } = CASES[type];
    const key = contentInfoOptions(type, slug).queryKey;

    it('shapes the cached info into the header content', async () => {
        const queryClient = newQueryClient();
        queryClient.setQueryData(key, data as never);

        const result = await mount(queryClient, type);

        expect(result.current?.data).toEqual({
            content_type: type,
            title,
            image,
        });
    });

    it('holds a single observer on the content info key', async () => {
        const queryClient = newQueryClient();
        queryClient.setQueryData(key, data as never);

        await mount(queryClient, type);

        const queries = queryClient.getQueryCache().getAll();
        expect(queries.map((query) => query.queryHash)).toEqual([hashKey(key)]);
        expect(queries[0].getObserversCount()).toBe(1);
    });

    it('fetches only its own info while pending', async () => {
        const fetchSpy = vi.fn(() => new Promise<Response>(() => {}));
        vi.stubGlobal('fetch', fetchSpy);
        const queryClient = newQueryClient();

        const result = await mount(queryClient, type);

        expect(result.current?.isPending).toBe(true);
        expect(result.current?.data).toBeUndefined();
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(
            queryClient
                .getQueryCache()
                .getAll()
                .map((query) => query.queryHash),
        ).toEqual([hashKey(key)]);
    });
});
