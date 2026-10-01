import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
    type CharacterAnimeResponse,
    type CharacterCountResponse,
    ContentTypeEnum,
    characterInfoOptions,
} from '@hikka/api';

import {
    ENTITY_PREVIEW_SIZE,
    entityAppearanceOptions,
} from '@/utils/api/content-queries';

import CharacterTooltip from './character-tooltip';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('./hover-card-wrapper', () => ({
    default: ({ content }: { content: React.ReactNode }) => <>{content}</>,
}));

vi.mock('../poster-card', () => ({
    default: ({ href }: { href: string }) => <a href={href}>poster</a>,
}));

vi.mock('@/components/markdown', () => ({
    MDViewer: ({ children }: { children: React.ReactNode }) => (
        <p>{children}</p>
    ),
}));

vi.mock('@/services/session', () => ({
    useTitle: () => 'Frieren',
}));

const SLUG = 'frieren';

const anime = (slug: string, score: number) =>
    ({
        anime: { slug, score, image: null },
    }) as unknown as CharacterAnimeResponse;

function renderTooltip(queryClient: QueryClient) {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
        root.render(
            <QueryClientProvider client={queryClient}>
                <CharacterTooltip slug={SLUG}>
                    <span>trigger</span>
                </CharacterTooltip>
            </QueryClientProvider>,
        );
    });
    return { container, unmount: () => act(() => root.unmount()) };
}

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('CharacterTooltip anime poster', () => {
    it('reads the preview page the character page already cached, without fetching', () => {
        const fetchSpy = vi.fn();
        vi.stubGlobal('fetch', fetchSpy);

        const queryClient = new QueryClient();
        queryClient.setQueryData(
            characterInfoOptions({ path: { slug: SLUG } }).queryKey,
            {
                slug: SLUG,
                image: null,
                description_ua: 'Опис',
            } as unknown as CharacterCountResponse,
        );
        queryClient.setQueryData(
            entityAppearanceOptions(ContentTypeEnum.CHARACTER, 'anime', SLUG, {
                preview: true,
            }).queryKey,
            {
                pages: [
                    {
                        list: [anime('low', 5), anime('top', 9)],
                        pagination: {
                            page: 1,
                            pages: 1,
                            total: 2,
                        },
                    },
                ],
                pageParams: [1],
            },
        );

        const { container, unmount } = renderTooltip(queryClient);

        const hrefs = [...container.querySelectorAll('a')].map((a) =>
            a.getAttribute('href'),
        );
        expect(hrefs).toContain('/anime/top');
        expect(hrefs).not.toContain('/anime/low');
        expect(fetchSpy).not.toHaveBeenCalled();
        unmount();
    });

    it('requests only the preview-sized first page', () => {
        expect(
            entityAppearanceOptions(ContentTypeEnum.CHARACTER, 'anime', SLUG, {
                preview: true,
            }).queryKey[0].query,
        ).toEqual({ size: ENTITY_PREVIEW_SIZE });
    });
});
