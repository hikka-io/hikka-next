import { type FC, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';
import {
    type NativeScrollEvent,
    type NativeSyntheticEvent,
    RefreshControl,
    ScrollView,
    View,
} from 'react-native';

import { ArticleCategoryEnum, VoteContentTypeEnum } from '@hikka/api';

import { ArticleDocument } from '@/components/article';
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

type Props = {
    slug: string;
};

/** The web's article page: author, content chip, title, the document, tags, votes, then the comments slot. */
const ArticlePage: FC<Props> = ({ slug }) => {
    const router = useRouter();
    const { data, error, isPending, refetch } = useQuery(articleOptions(slug));
    const { hasToken } = useSession();
    const { refreshing, onRefresh } = usePullToRefresh(bySlug(slug));
    const [titleTop, setTitleTop] = useState(0);
    const [titleBottom, setTitleBottom] = useState<number | null>(null);
    const [titleVisible, setTitleVisible] = useState(false);
    // System notices have no author card or votes on the web.
    const system = data?.category === ArticleCategoryEnum.SYSTEM;

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, contentInset } = event.nativeEvent;
        setTitleVisible(
            titleBottom !== null &&
                contentOffset.y + contentInset.top > titleTop + titleBottom,
        );
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
                <ScrollView
                    className="flex-1 bg-background"
                    contentInsetAdjustmentBehavior="automatic"
                    contentContainerClassName="gap-6 px-4 pt-4 pb-16"
                    scrollEventThrottle={16}
                    onScroll={onScroll}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    {!system && (
                        <Card>
                            <ArticleAuthor article={data} />
                        </Card>
                    )}
                    <View
                        className="gap-3"
                        onLayout={(event) =>
                            setTitleTop(event.nativeEvent.layout.y)
                        }
                    >
                        {data.content && (
                            <ArticleContentChip content={data.content} />
                        )}
                        <Text
                            accessibilityRole="header"
                            selectable
                            onLayout={(event) => {
                                const { y, height } = event.nativeEvent.layout;
                                setTitleBottom(y + height);
                            }}
                            className="font-bold text-2xl leading-8"
                        >
                            {data.title}
                        </Text>
                    </View>
                    <ArticleDocument
                        key={slug}
                        document={data.document}
                        authenticated={hasToken}
                        selectable
                    />
                    <ArticleTags tags={data.tags} />
                    {!system && (
                        <View className="flex-row items-center gap-2">
                            <VoteButton
                                contentType={VoteContentTypeEnum.ARTICLE}
                                slug={slug}
                                myScore={data.my_score}
                                voteScore={data.vote_score}
                            />
                            <StatItem
                                accessibilityLabel={`Коментарі: ${data.comments_count}`}
                                onPress={() =>
                                    router.push(`/comments/article/${slug}`)
                                }
                            >
                                <Icon as={MessageCircle} />
                                {data.comments_count}
                            </StatItem>
                        </View>
                    )}
                    <ArticleCommentsSlot slug={slug} />
                </ScrollView>
            ) : null}
        </>
    );
};

export default ArticlePage;
