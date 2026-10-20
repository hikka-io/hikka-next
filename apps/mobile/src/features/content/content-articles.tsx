import type { FC } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { View } from 'react-native';

import Card from '@/components/ui/card';
import ErrorState from '@/components/ui/error-state';
import { Header, HeaderTitle } from '@/components/ui/header';
import { Separator } from '@/components/ui/separator';
import { ArticleRow, ArticleRowSkeleton } from '@/features/articles';

import { useVisibleOnce } from './detail-scroll';
import {
    ARTICLES_PREVIEW_SIZE,
    type ContentInfo,
    contentArticlesOptions,
} from './queries';

const SKELETONS: null[] = Array.from(
    { length: ARTICLES_PREVIEW_SIZE },
    () => null,
);

type Props = {
    content: ContentInfo;
};

/** The web's `ContentArticles`: the newest articles about the title, hidden when there are none. */
const ContentArticles: FC<Props> = ({ content }) => {
    const { onLayout, visible } = useVisibleOnce();
    const { data, isPending, error, refetch } = useInfiniteQuery({
        ...contentArticlesOptions(content.data_type, content.slug, {
            preview: true,
        }),
        enabled: visible,
    });
    const items = data?.pages[0]?.list;

    if (!isPending && !error && !items?.length) return null;

    return (
        <View onLayout={onLayout} className="gap-3">
            <Header>
                <HeaderTitle
                    href={{
                        pathname: '/articles',
                        params: {
                            content_type: content.data_type,
                            content_slug: content.slug,
                        },
                    }}
                    count={data?.pages[0]?.pagination.total}
                    countPending={isPending && !error}
                >
                    Статті
                </HeaderTitle>
            </Header>
            {error ? (
                <ErrorState variant="inline" onRetry={() => void refetch()} />
            ) : (
                <Card className="gap-0 overflow-hidden p-0">
                    {(items ?? SKELETONS).map((article, index) => (
                        <View key={article?.slug ?? `skeleton-${index}`}>
                            {index > 0 && <Separator />}
                            {article ? (
                                <ArticleRow article={article} />
                            ) : (
                                <ArticleRowSkeleton />
                            )}
                        </View>
                    ))}
                </Card>
            )}
        </View>
    );
};

export default ContentArticles;
