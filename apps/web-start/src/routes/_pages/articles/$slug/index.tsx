import type { ComponentProps } from 'react';

import { createFileRoute } from '@tanstack/react-router';

import { useQuery } from '@tanstack/react-query';

import { getArticleOptions } from '@hikka/api';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import Link from '@/components/ui/link';
import Breadcrumbs from '@/features/app-shell/nav-breadcrumbs';
import {
    ArticleAuthor,
    ArticleDocumentView,
    ArticleNavbar,
    ArticleTags,
    ArticleTitle,
} from '@/features/articles';
import { CommentList as Comments } from '@/features/comments';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

export const Route = createFileRoute('/_pages/articles/$slug/')({
    component: ArticlePage,
});

function ArticlePage() {
    const { slug } = Route.useParams();
    const { data: article } = useQuery(getArticleOptions({ path: { slug } }));

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
            <Breadcrumbs>
                <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                    <Link
                        to={`${CONTENT_TYPE_LINKS.article}/${slug}`}
                        className="flex-1 overflow-hidden text-ellipsis font-bold text-sm hover:underline"
                    >
                        {article?.title}
                    </Link>
                </div>
            </Breadcrumbs>
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
                    {/* TODO(phase2): drop cast once CommentList is migrated to @hikka/api types */}
                    <Comments
                        preview
                        slug={slug}
                        content_type={
                            'article' as ComponentProps<
                                typeof Comments
                            >['content_type']
                        }
                    />
                </Block>
                <ArticleNavbar />
            </div>
        </>
    );
}
