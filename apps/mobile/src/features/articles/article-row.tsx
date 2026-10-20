import type { FC } from 'react';

import { Link } from 'expo-router';
import { ArrowBigUp, Eye, MessageCircle } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import type { ArticleCategoryEnum, ArticlePreviewResponse } from '@hikka/api';
import { ARTICLE_CATEGORY, formatTimeAgo } from '@hikka/core';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { StatItem, StatItemGroup } from '@/components/ui/stat-item';
import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';

import { getArticleExcerpt } from './article-excerpt';

type Props = {
    article: ArticlePreviewResponse;
    /** On a profile the author is known: no author line and no excerpt, like the web's compact item. */
    compact?: boolean;
};

/** One article as a list row: author, category, title, excerpt, time and stats. */
const ArticleRow: FC<Props> = ({ article, compact }) => {
    const category = article.category as ArticleCategoryEnum;
    const excerpt = compact ? '' : getArticleExcerpt(article.preview);

    return (
        <Link href={`/articles/${article.slug}`} asChild>
            <Pressable
                accessibilityRole="link"
                className="gap-2 px-4 py-3 active:opacity-70"
            >
                <View className="flex-row items-center justify-between gap-2">
                    {compact ? (
                        <View className="flex-1" />
                    ) : (
                        <View className="min-w-0 flex-1 flex-row items-center gap-2">
                            <Avatar className="size-5 rounded-sm">
                                <AvatarImage
                                    src={article.author.avatar}
                                    size={20}
                                />
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
                    )}
                    <Badge variant="outline">
                        {ARTICLE_CATEGORY[category]?.title_ua ?? category}
                    </Badge>
                    {article.draft && <Badge variant="warning">Чернетка</Badge>}
                </View>
                <Text
                    numberOfLines={2}
                    className="font-semibold text-sm leading-5"
                >
                    {article.title}
                </Text>
                {excerpt ? (
                    <Text
                        numberOfLines={1}
                        maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                        className="text-muted-foreground text-xs"
                    >
                        {excerpt}
                    </Text>
                ) : null}
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
        </Link>
    );
};

export default ArticleRow;
