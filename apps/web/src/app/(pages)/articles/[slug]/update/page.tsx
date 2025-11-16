import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import { prefetchArticleBySlug } from '@hikka/react/server';
import Link from 'next/link';
import { permanentRedirect } from 'next/navigation';

import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';

import {
    ArticleEditDocument as ArticleDocument,
    ArticleSettings,
    ArticleEditTitle as ArticleTitle
} from '@/features/articles';

import ArticleProvider from '@/services/providers/article-provider';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import getHikkaClientConfig from '@/utils/get-hikka-client-config';
import { cn } from '@/utils/utils';

const ArticleUpdatePage = async (props: {
    params: Promise<Record<string, any>>;
}) => {
    const params = await props.params;
    const { slug } = params;

    const queryClient = await getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    const article = await prefetchArticleBySlug({
        slug: slug,
        clientConfig,
        queryClient,
    });

    if (!article) {
        return permanentRedirect('/');
    }

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <Breadcrumbs>
                <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                    <div
                        className={cn(
                            'size-2 rounded-full',
                            article.draft
                                ? 'bg-warning-foreground'
                                : 'bg-success-foreground',
                        )}
                    />
                    <Link
                        href={`${CONTENT_TYPE_LINKS['article']}/${slug}`}
                        className="flex-1 overflow-hidden text-ellipsis text-sm font-bold hover:underline"
                    >
                        {article?.title}
                    </Link>
                </div>
            </Breadcrumbs>
            <ArticleProvider
                initialState={{
                    ...article,
                    document: article.document,
                    tags: article.tags.map((tag) => tag.name),
                }}
            >
                <div className="grid grid-cols-1 justify-center md:grid-cols-[1fr_30%] md:items-start md:justify-between md:gap-16 lg:grid-cols-[1fr_25%]">
                    <Block>
                        <ArticleTitle />
                        <Card className="flex w-full p-0 md:hidden">
                            <ArticleSettings />
                        </Card>
                        <ArticleDocument />
                    </Block>
                    <Card className="bg-secondary/20 sticky top-20 order-1 hidden w-full self-start p-0 backdrop-blur-xl md:flex">
                        <ArticleSettings />
                    </Card>
                </div>
            </ArticleProvider>
        </HydrationBoundary>
    );
};

export default ArticleUpdatePage;
