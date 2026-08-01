import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { getArticleOptions } from '@hikka/api';

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

    const jsonLd = article
        ? {
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: article.title,
              author: {
                  '@type': 'Person',
                  name: article.author.username,
              },
              publisher: {
                  '@type': 'Organization',
                  name: 'Hikka',
                  logo: {
                      '@type': 'ImageObject',
                      url: 'https://hikka.io/logo-icon.png',
                  },
              },
              datePublished: article.created,
              dateModified: article.updated || article.created,
          }
        : null;

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD structured data, no user input.
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLd),
                    }}
                />
            )}
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
