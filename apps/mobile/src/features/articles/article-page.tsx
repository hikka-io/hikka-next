import { type FC, useEffect, useMemo, useState } from 'react';

import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';
import {
    type NativeScrollEvent,
    type NativeSyntheticEvent,
    View,
} from 'react-native';

import {
    ArticleCategoryEnum,
    type ArticleDocumentResponse,
    VoteContentTypeEnum,
} from '@hikka/api';
import { type ArticleBlockNode, normalizeArticleDocument } from '@hikka/core';

import { ArticleBlock } from '@/components/article';
import DetailHeaderChrome from '@/components/detail-header-chrome';
import Card from '@/components/ui/card';
import ErrorState from '@/components/ui/error-state';
import { Icon } from '@/components/ui/icon';
import { StatItem } from '@/components/ui/stat-item';
import { Text } from '@/components/ui/text';
import VoteButton from '@/components/vote-button';
import { useSession } from '@/features/auth';
import { isNotFoundError } from '@/utils/api/is-not-found';
import { bySlug, usePullToRefresh } from '@/utils/api/use-pull-to-refresh';

import ArticleAuthor from './article-author';
import ArticleContentChip from './article-content-chip';
import ArticleSkeleton from './article-skeleton';
import ArticleTags from './article-tags';
import ArticleCommentsSlot from './comments-slot';
import { articleOptions } from './queries';

// The list's `pt-4`, so a header child's layout `y` maps to the scroll offset.
const LIST_TOP_PADDING = 16;

type Item =
    | { kind: 'header' }
    | { kind: 'block'; block: ArticleBlockNode; index: number }
    | { kind: 'footer' }
    | { kind: 'comments' };

type HeaderProps = {
    article: ArticleDocumentResponse;
    system: boolean;
    onTitleBottom: (bottom: number) => void;
};

const ArticleHeader: FC<HeaderProps> = ({ article, system, onTitleBottom }) => {
    const [titleTop, setTitleTop] = useState<number | null>(null);
    const [titleEnd, setTitleEnd] = useState<number | null>(null);

    // Child layouts arrive before the parent's, so the title's offset is summed once both are known.
    useEffect(() => {
        if (titleTop !== null && titleEnd !== null) {
            onTitleBottom(LIST_TOP_PADDING + titleTop + titleEnd);
        }
    }, [titleTop, titleEnd, onTitleBottom]);

    return (
        <View className="gap-6 pb-6">
            {!system && (
                <Card>
                    <ArticleAuthor article={article} />
                </Card>
            )}
            <View
                className="gap-3"
                onLayout={(event) => setTitleTop(event.nativeEvent.layout.y)}
            >
                {article.content && (
                    <ArticleContentChip content={article.content} />
                )}
                <Text
                    accessibilityRole="header"
                    selectable
                    onLayout={(event) => {
                        const { y, height } = event.nativeEvent.layout;
                        setTitleEnd(y + height);
                    }}
                    className="font-bold text-2xl leading-8"
                >
                    {article.title}
                </Text>
            </View>
        </View>
    );
};

type Props = {
    slug: string;
};

/** The web's article page: author, content chip, title, the document, tags, votes, then the comments slot; blocks mount as they scroll in. */
const ArticlePage: FC<Props> = ({ slug }) => {
    const router = useRouter();
    const { data, error, isPending, refetch } = useQuery(articleOptions(slug));
    const { hasToken } = useSession();
    const { refreshing, onRefresh } = usePullToRefresh(bySlug(slug));
    const [titleBottom, setTitleBottom] = useState<number | null>(null);
    const [titleVisible, setTitleVisible] = useState(false);
    // System notices have no author card or votes on the web.
    const system = data?.category === ArticleCategoryEnum.SYSTEM;

    const items = useMemo<Item[]>(
        () =>
            data
                ? [
                      { kind: 'header' },
                      ...normalizeArticleDocument(data.document).map(
                          (block, index): Item => ({
                              kind: 'block',
                              block,
                              index,
                          }),
                      ),
                      { kind: 'footer' },
                      { kind: 'comments' },
                  ]
                : [],
        [data],
    );

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, contentInset } = event.nativeEvent;
        setTitleVisible(
            titleBottom !== null &&
                contentOffset.y + contentInset.top > titleBottom,
        );
    };

    const renderItem = (item: Item, article: ArticleDocumentResponse) => {
        switch (item.kind) {
            case 'header':
                return (
                    <ArticleHeader
                        article={article}
                        system={system}
                        onTitleBottom={setTitleBottom}
                    />
                );
            case 'block':
                return (
                    // Keyed per block, so a recycled cell never keeps another block's revealed spoiler.
                    <View key={`${slug}:${item.index}`} className="pb-4">
                        <ArticleBlock
                            block={item.block}
                            authenticated={hasToken}
                            selectable
                        />
                    </View>
                );
            case 'footer':
                return (
                    <View className="gap-6 pt-2 pb-6">
                        <ArticleTags tags={article.tags} />
                        {!system && (
                            <View className="flex-row items-center gap-2">
                                <VoteButton
                                    contentType={VoteContentTypeEnum.ARTICLE}
                                    slug={slug}
                                    myScore={article.my_score}
                                    voteScore={article.vote_score}
                                />
                                <StatItem
                                    accessibilityLabel={`Коментарі: ${article.comments_count}`}
                                    onPress={() =>
                                        router.push(`/comments/article/${slug}`)
                                    }
                                >
                                    <Icon as={MessageCircle} />
                                    {article.comments_count}
                                </StatItem>
                            </View>
                        )}
                    </View>
                );
            case 'comments':
                return <ArticleCommentsSlot slug={slug} />;
        }
    };

    return (
        <>
            <DetailHeaderChrome
                title={data?.title ?? ''}
                titleVisible={titleVisible}
                sharePath={data ? `/articles/${slug}` : undefined}
            />
            {isPending ? (
                <ArticleSkeleton />
            ) : error && !data ? (
                <ErrorState
                    error={error}
                    onRetry={refetch}
                    notFound={isNotFoundError(error)}
                />
            ) : data ? (
                <FlashList
                    className="bg-background"
                    contentInsetAdjustmentBehavior="automatic"
                    contentContainerClassName="px-4 pt-4 pb-16"
                    data={items}
                    keyExtractor={(item) =>
                        item.kind === 'block'
                            ? `block-${item.index}`
                            : item.kind
                    }
                    getItemType={(item) =>
                        item.kind === 'block' ? item.block.type : item.kind
                    }
                    renderItem={({ item }) => renderItem(item, data)}
                    scrollEventThrottle={16}
                    onScroll={onScroll}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            ) : null}
        </>
    );
};

export default ArticlePage;
