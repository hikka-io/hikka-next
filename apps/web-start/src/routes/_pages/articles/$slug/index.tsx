import { ContentTypeEnum } from '@hikka/client';
import { useArticleBySlug } from '@hikka/react';
import { createFileRoute } from '@tanstack/react-router';
import Link from '@/components/ui/link';

import Breadcrumbs from '@/features/common/nav-breadcrumbs';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import {
    ArticleAuthor,
    ArticleDocument,
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
    const { data: article } = useArticleBySlug({ slug });

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
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLd),
                    }}
                />
            )}
            <Breadcrumbs>
                <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                    <Link
                        to={`${CONTENT_TYPE_LINKS['article']}/${slug}`}
                        className="flex-1 overflow-hidden text-ellipsis text-sm font-bold hover:underline"
                    >
                        {article?.title}
                    </Link>
                </div>
            </Breadcrumbs>
            <div className="w-full mx-auto isolate flex max-w-3xl flex-col gap-12 p-0">
                {article?.category !== 'system' && (
                    <Card className="gap-0 overflow-hidden p-0">
                        <ArticleAuthor />
                    </Card>
                )}
                <Block className="isolate">
                    <ArticleTitle />
                    <ArticleDocument />
                    <ArticleTags />
                    <Comments
                        preview
                        slug={slug}
                        content_type={ContentTypeEnum.ARTICLE}
                    />
                </Block>
                <ArticleNavbar />
            </div>
        </>
    );
}
