import type { ReactNode } from 'react';
import { renderToString } from 'react-dom/server';

import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query';
import type { Value } from 'platejs';
import { describe, expect, it, vi } from 'vitest';

import { type GetArticleResponse, getArticleOptions } from '@hikka/api';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { usePageHeader } from '@/features/app-shell';
import { CONTENT_TYPE_LINKS } from '@/utils/content-paths';

import ArticleEditDocument from './article-edit/article-document';
import ArticleProvider from './article-edit/article-provider';
import ArticleEditSettings from './article-edit/article-settings';
import type { ArticleState } from './article-edit/article-store';
import ArticleEditTitle from './article-edit/article-title';
import ArticleEditorPage from './article-editor-page';

vi.mock('@/features/app-shell', () => ({ usePageHeader: vi.fn() }));
vi.mock('./article-edit/article-document', () => ({
    default: () => <div data-stub="document" />,
}));
vi.mock('./article-edit/article-settings', () => ({
    default: () => <div data-stub="settings" />,
}));
vi.mock('./article-edit/article-title', async () => {
    const { useArticleContext } = await import(
        './article-edit/article-provider'
    );
    return {
        default: () => {
            const state = useArticleContext((store) => store);
            return <pre>{JSON.stringify(state)}</pre>;
        },
    };
});

const SLUG = 'some-article-1a2b3c';

const ARTICLE = {
    slug: SLUG,
    title: 'Стаття',
    draft: false,
    category: 'news',
    document: [{ type: 'p', children: [{ text: 'x' }] }],
    tags: [{ name: 'a', content_count: 1 }],
} as unknown as GetArticleResponse;

function LegacyArticleNewPage() {
    usePageHeader({ title: 'Нова стаття', parent: '/articles' });

    return (
        <ArticleProvider>
            <div className="grid grid-cols-1 justify-center md:grid-cols-[1fr_30%] md:items-start md:justify-between md:gap-x-10 lg:grid-cols-[1fr_25%]">
                <Block>
                    <ArticleEditTitle />
                    <Card className="-mx-4 flex w-auto rounded-none border-x-0 p-0 md:hidden">
                        <ArticleEditSettings />
                    </Card>
                    <ArticleEditDocument />
                </Block>
                <Card className="sticky top-20 order-1 hidden w-full self-start p-0 md:flex">
                    <ArticleEditSettings />
                </Card>
            </div>
        </ArticleProvider>
    );
}

function LegacyArticleUpdatePage({ slug }: { slug: string }) {
    const { data: article } = useQuery(getArticleOptions({ path: { slug } }));

    usePageHeader({
        title: article?.title,
        subtitle: article?.draft ? 'Чернетка' : 'Опубліковано',
        parent: `${CONTENT_TYPE_LINKS.article}/${slug}`,
    });

    if (!article) return null;

    return (
        <ArticleProvider
            initialState={
                {
                    ...article,
                    document: article.document as Value,
                    tags: article.tags.map((tag: { name: string }) => tag.name),
                } as Partial<ArticleState>
            }
        >
            <div className="grid grid-cols-1 justify-center md:grid-cols-[1fr_30%] md:items-start md:justify-between md:gap-x-10 lg:grid-cols-[1fr_25%]">
                <Block>
                    <ArticleEditTitle />
                    <Card className="-mx-4 flex w-auto rounded-none border-x-0 p-0 md:hidden">
                        <ArticleEditSettings />
                    </Card>
                    <ArticleEditDocument />
                </Block>
                <Card className="sticky top-20 order-1 hidden w-full self-start p-0 md:flex">
                    <ArticleEditSettings />
                </Card>
            </div>
        </ArticleProvider>
    );
}

const render = (node: ReactNode, cached: boolean) => {
    const queryClient = new QueryClient();
    if (cached) {
        queryClient.setQueryData(
            getArticleOptions({ path: { slug: SLUG } }).queryKey,
            ARTICLE,
        );
    }
    vi.mocked(usePageHeader).mockClear();
    const html = renderToString(
        <QueryClientProvider client={queryClient}>{node}</QueryClientProvider>,
    );
    return { html, header: [...vi.mocked(usePageHeader).mock.calls] };
};

describe('ArticleEditorPage', () => {
    it('renders the new and update routes like the former route bodies', () => {
        const newPage = render(<ArticleEditorPage />, false);
        expect(newPage).toEqual(render(<LegacyArticleNewPage />, false));
        expect(newPage.html).toContain('data-stub="document"');

        const updatePage = render(<ArticleEditorPage slug={SLUG} />, true);
        expect(updatePage).toEqual(
            render(<LegacyArticleUpdatePage slug={SLUG} />, true),
        );
        expect(updatePage.html).toContain('&quot;tags&quot;:[&quot;a&quot;]');

        expect(render(<ArticleEditorPage slug={SLUG} />, false).html).toBe('');
    });
});
