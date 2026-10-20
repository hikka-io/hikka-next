import { type FC, useState } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { ArrowBigUp, Eye, MessageCircle, Newspaper } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import type { ArticleCategoryEnum, ArticlePreviewResponse } from '@hikka/api';
import {
    ARTICLE_CATEGORY,
    type CommunityTab,
    formatTimeAgo,
} from '@hikka/core';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Icon } from '@/components/ui/icon';
import SegmentedControl from '@/components/ui/segmented-control';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { StatItem, StatItemGroup } from '@/components/ui/stat-item';
import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';

import { getArticleExcerpt } from '../article-excerpt';
import { flattenPages } from '../flatten-pages';
import { ARTICLES_PREVIEW_SIZE, homeArticlesTabOptions } from '../queries';
import { useOpenSitePath } from '../use-open-site-path';
import WidgetSection from '../widget-section';

const ArticleRow: FC<{ article: ArticlePreviewResponse }> = ({ article }) => {
    const openSitePath = useOpenSitePath();
    const category = article.category as ArticleCategoryEnum;
    const excerpt = getArticleExcerpt(article.preview);

    return (
        <Pressable
            accessibilityRole="link"
            onPress={() => openSitePath(`/articles/${article.slug}`)}
            className="gap-2 px-4 py-3 active:opacity-70"
        >
            <View className="flex-row items-center justify-between gap-2">
                <View className="min-w-0 flex-1 flex-row items-center gap-2">
                    <Avatar className="size-5 rounded-sm">
                        <AvatarImage src={article.author.avatar} size={20} />
                        <AvatarFallback className="rounded-sm" />
                    </Avatar>
                    <Text
                        numberOfLines={1}
                        maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                        className="shrink text-muted-foreground text-xs"
                    >
                        {article.author.username}
                    </Text>
                </View>
                <Badge variant="outline">
                    {ARTICLE_CATEGORY[category]?.title_ua ?? category}
                </Badge>
                {article.draft && <Badge variant="warning">Чернетка</Badge>}
            </View>
            <Text numberOfLines={2} className="font-semibold text-sm leading-5">
                {article.title}
            </Text>
            {excerpt && (
                <Text
                    numberOfLines={1}
                    maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                    className="text-muted-foreground text-xs"
                >
                    {excerpt}
                </Text>
            )}
            <View className="flex-row items-center justify-between gap-2">
                <Text
                    maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                    className="text-muted-foreground text-xs"
                >
                    {formatTimeAgo(article.created, Date.now())}
                </Text>
                <StatItemGroup size="sm">
                    <StatItem size="sm">
                        <Icon as={Eye} />
                        {article.views}
                    </StatItem>
                    <StatItem size="sm">
                        <Icon as={MessageCircle} />
                        {article.comments_count}
                    </StatItem>
                    <StatItem size="sm">
                        <Icon as={ArrowBigUp} className="size-4" />
                        {article.vote_score}
                    </StatItem>
                </StatItemGroup>
            </View>
        </Pressable>
    );
};

const ArticleSkeleton: FC = () => {
    return (
        <View className="gap-2 px-4 py-3">
            <View className="flex-row items-center gap-2">
                <Skeleton className="size-5 rounded-sm" />
                <Skeleton className="h-3 w-24" />
            </View>
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-3 w-full" />
            <View className="flex-row items-center justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-24" />
            </View>
        </View>
    );
};

type Props = {
    username?: string;
};

const ArticlesWidget: FC<Props> = ({ username }) => {
    const openSitePath = useOpenSitePath();
    const [tab, setTab] = useState<CommunityTab>('newest');
    const own = !!username && tab === 'own';
    const { data, isPending, isError, refetch } = useInfiniteQuery(
        homeArticlesTabOptions(tab, username),
    );
    const list = flattenPages(data);

    const tabs = [
        { value: 'newest' as const, label: 'Нові' },
        { value: 'popular' as const, label: 'Популярні' },
        ...(username ? [{ value: 'own' as const, label: 'Мої' }] : []),
    ];

    return (
        <WidgetSection title="Статті" onPress={() => openSitePath('/articles')}>
            <SegmentedControl
                options={tabs}
                value={tab}
                onValueChange={setTab}
            />
            {isError && <ErrorState variant="section" onRetry={refetch} />}
            {(isPending || (list && list.length > 0)) && (
                <Card className="gap-0 overflow-hidden p-0">
                    {isPending &&
                        Array.from(
                            { length: ARTICLES_PREVIEW_SIZE },
                            (_, index) => (
                                <View key={index}>
                                    {index > 0 && <Separator />}
                                    <ArticleSkeleton />
                                </View>
                            ),
                        )}
                    {list?.map((article, index) => (
                        <View key={article.slug}>
                            {index > 0 && <Separator />}
                            <ArticleRow article={article} />
                        </View>
                    ))}
                </Card>
            )}
            {list?.length === 0 && (
                <EmptyState
                    size="sm"
                    bordered
                    icon={<Icon as={Newspaper} />}
                    title={own ? 'У вас ще немає статей' : 'Немає статей'}
                />
            )}
        </WidgetSection>
    );
};

export default ArticlesWidget;
