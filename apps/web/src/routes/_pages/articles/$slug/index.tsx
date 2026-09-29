import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { getArticleOptions } from '@hikka/api';

import JsonLd from '@/components/json-ld';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { usePageHeader } from '@/features/app-shell';
import {
    ArticleActionsMenu,
    ArticleAuthor,
    ArticleDocumentView,
    ArticleNavbar,
    ArticleTags,
    ArticleTitle,
} from '@/features/articles';
import { CommentList as Comments } from '@/features/comments';
import { articleJsonLd } from '@/utils/json-ld';

export const Route = createFileRoute('/_pages/articles/$slug/')({
    component: ArticlePage,
});

function ArticlePage() {
    const { slug } = Route.useParams();
    const { data: article } = useQuery(getArticleOptions({ path: { slug } }));

    usePageHeader({
        title: article?.title,
        subtitle: article?.author.username,
        parent: '/articles',
        anchored: true,
        actionsComponent: ArticleActionsMenu,
    });

    return (
        <>
            {article && <JsonLd data={articleJsonLd(article)} />}
            <div className="isolate mx-auto flex w-full max-w-3xl flex-col gap-12 p-0">
                {article?.category !== 'system' && (
                    <Card className="gap-0 overflow-hidden p-0">
                        <ArticleAuthor />
                    </Card>
                )}
                <Block className="isolate">
                    <ArticleTitle />
                    <ArticleDocumentView />
                    <ArticleTags />
                    <Comments preview slug={slug} content_type="article" />
                </Block>
                <ArticleNavbar />
            </div>
        </>
    );
}
