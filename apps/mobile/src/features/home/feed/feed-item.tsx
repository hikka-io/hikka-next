import type { FC } from 'react';

import { type Href, Link, useRouter } from 'expo-router';
import { ArrowBigUp, MessageCircle } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import {
    type ArticleCategoryEnum,
    type ArticlePreviewResponse,
    type CollectionResponse,
    type CommentResponseFeed,
    ContentTypeEnum,
    type ReviewResponse,
} from '@hikka/api';
import {
    ARTICLE_CATEGORY,
    CONTENT_TYPES,
    contentPath,
    formatTimeAgo,
    getTitle,
} from '@hikka/core';

import PosterCard from '@/components/content-card/poster-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import Image from '@/components/ui/image';
import { StatItem, StatItemGroup } from '@/components/ui/stat-item';
import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';
import { cn } from '@/utils/cn';

import { getArticleExcerpt } from '../article-excerpt';
import { useHomePreferences } from '../use-home-preferences';
import { openWebPage } from '../web-page';
import ClampedMarkdown from './clamped-markdown';
import {
    type CommentPreview,
    type FeedItemResponse,
    getFeedItemPath,
} from './feed-item-types';

const MAX_PREVIEW = 3;
const IN_APP_TYPES = new Set<string>([
    ContentTypeEnum.ANIME,
    ContentTypeEnum.MANGA,
    ContentTypeEnum.NOVEL,
    ContentTypeEnum.CHARACTER,
    ContentTypeEnum.PERSON,
]);

const TYPE_STYLES = {
    comment: { badge: 'bg-feed-comment/10', text: 'text-feed-comment' },
    article: { badge: 'bg-feed-article/10', text: 'text-feed-article' },
    collection: {
        badge: 'bg-feed-collection/10',
        text: 'text-feed-collection',
    },
} as const;

const VERDICTS = {
    yes: { label: 'Рекомендує', variant: 'success' },
    no: { label: 'Не рекомендує', variant: 'destructive' },
    maybe: { label: 'Вагається', variant: 'warning' },
} as const;

type Reference = {
    contentType?: string;
    slug?: string;
    title?: string;
};

const ReviewBadge: FC<{ review: ReviewResponse }> = ({ review }) => {
    const verdict = VERDICTS[review.recommended];

    return (
        <View className="flex-row items-center gap-1">
            <Badge variant={verdict.variant}>{verdict.label}</Badge>
            {!!review.score && (
                <Badge variant={verdict.variant}>{review.score}</Badge>
            )}
        </View>
    );
};

const TypeBadge: FC<{
    dataType: keyof typeof TYPE_STYLES;
    category?: ArticleCategoryEnum;
}> = ({ dataType, category }) => {
    const label =
        dataType === 'article' && category && ARTICLE_CATEGORY[category]
            ? ARTICLE_CATEGORY[category].title_ua
            : CONTENT_TYPES[dataType as ContentTypeEnum].title_ua;

    return (
        <Badge
            className={cn('border-transparent', TYPE_STYLES[dataType].badge)}
            textClassName={TYPE_STYLES[dataType].text}
        >
            {label}
        </Badge>
    );
};

const ReferenceBadge: FC<{ reference: Reference }> = ({ reference }) => {
    const router = useRouter();
    const { contentType, slug, title } = reference;

    if (!contentType || !slug) return null;

    const open = () =>
        IN_APP_TYPES.has(contentType)
            ? router.push(
                  contentPath(contentType as ContentTypeEnum, slug) as Href,
              )
            : openWebPage(contentPath(contentType as ContentTypeEnum, slug));

    return (
        <Pressable
            accessibilityRole="link"
            onPress={open}
            className="-my-2 min-h-11 max-w-full justify-center self-start active:opacity-70"
        >
            <Badge variant="secondary" className="max-w-full">
                <Text numberOfLines={1} className="shrink">
                    {title ?? slug}
                </Text>
            </Badge>
        </Pressable>
    );
};

const CollectionBody: FC<{ data: CollectionResponse }> = ({ data }) => {
    const previewItems = data.collection.slice(0, MAX_PREVIEW);
    const remaining = data.entries - MAX_PREVIEW;
    const coverItem =
        data.collection[MAX_PREVIEW] ??
        data.collection[data.collection.length - 1];

    return (
        <View className="gap-3">
            <Text
                accessibilityRole="link"
                onPress={() => openWebPage(`/collections/${data.reference}`)}
                className="font-bold text-base"
            >
                {data.title}
            </Text>
            {(data.tags.length > 0 || data.spoiler || data.nsfw) && (
                <View className="flex-row flex-wrap gap-2">
                    {data.spoiler && <Badge variant="warning">Спойлери</Badge>}
                    {data.nsfw && <Badge variant="destructive">+18</Badge>}
                    {data.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary">
                            {tag}
                        </Badge>
                    ))}
                    {data.tags.length > 2 && (
                        <Badge variant="outline">+{data.tags.length - 2}</Badge>
                    )}
                </View>
            )}
            <View className="flex-row gap-2">
                {previewItems.map((item) => (
                    <View key={item.content.slug} className="flex-1">
                        <PosterCard
                            href={
                                contentPath(
                                    item.content.data_type as ContentTypeEnum,
                                    item.content.slug,
                                ) as Href
                            }
                            image={item.content.image ?? undefined}
                            titleBlur={data.spoiler}
                            imageBlur={data.nsfw || data.spoiler}
                        />
                    </View>
                ))}
                {remaining > 0 && coverItem && (
                    <View className="flex-1">
                        <PosterCard
                            onPress={() =>
                                openWebPage(`/collections/${data.reference}`)
                            }
                            image={
                                <View className="size-full items-center justify-center">
                                    {coverItem.content.image && (
                                        <Image
                                            source={coverItem.content.image}
                                            blurRadius={24}
                                            contentFit="cover"
                                            className="absolute inset-0 size-full"
                                        />
                                    )}
                                    <Text className="font-bold text-2xl text-white">
                                        +{remaining}
                                    </Text>
                                </View>
                            }
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

const ArticleBody: FC<{ data: ArticlePreviewResponse }> = ({ data }) => {
    const excerpt = getArticleExcerpt(data.preview);

    return (
        <View className="gap-3">
            <Text
                accessibilityRole="link"
                onPress={() => openWebPage(`/articles/${data.slug}`)}
                className="font-bold text-base"
            >
                {data.title}
            </Text>
            {data.tags.length > 0 && (
                <View className="flex-row gap-2">
                    {data.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag.name} variant="secondary">
                            {tag.name}
                        </Badge>
                    ))}
                    {data.tags.length > 2 && (
                        <Badge variant="outline">+{data.tags.length - 2}</Badge>
                    )}
                </View>
            )}
            {excerpt && (
                <Text
                    numberOfLines={3}
                    className="text-[15px] text-muted-foreground leading-[22px]"
                >
                    {excerpt}
                </Text>
            )}
        </View>
    );
};

const CommentBody: FC<{ data: CommentResponseFeed }> = ({ data }) => {
    if (!data.text) return null;

    return (
        <ClampedMarkdown onReadMore={() => openWebPage(getFeedItemPath(data))}>
            {data.text}
        </ClampedMarkdown>
    );
};

type Props = {
    item: FeedItemResponse;
};

const FeedItem: FC<Props> = ({ item }) => {
    const { titleLanguage, nameLanguage } = useHomePreferences();

    let reference: Reference | undefined;
    let review: ReviewResponse | undefined;
    let category: ArticleCategoryEnum | undefined;
    let commentsCount = 0;

    if (item.data_type === 'comment') {
        const preview = item.preview as CommentPreview;
        reference = {
            contentType: item.content_type,
            slug: preview.slug,
            title: preview.title,
        };
        review = item.review ?? undefined;
        commentsCount = item.total_replies ?? 0;
    } else if (item.data_type === 'article') {
        category = item.category as ArticleCategoryEnum;
        const content = item.content as {
            data_type?: string;
            slug?: string;
        } | null;
        reference = content
            ? {
                  contentType: content.data_type,
                  slug: content.slug,
                  title: getTitle(item.content, titleLanguage, nameLanguage),
              }
            : undefined;
        commentsCount = item.comments_count;
    } else {
        commentsCount = item.comments_count;
    }

    const openComments = () => openWebPage(getFeedItemPath(item));

    return (
        <View className="flex-row items-start gap-4 px-4 py-4">
            <Link href={`/u/${item.author.username}`} asChild>
                <Pressable
                    accessibilityRole="link"
                    className="active:opacity-70"
                >
                    <Avatar className="size-10 rounded-lg">
                        <AvatarImage src={item.author.avatar} />
                        <AvatarFallback className="rounded-lg">
                            {item.author.username?.[0]}
                        </AvatarFallback>
                    </Avatar>
                </Pressable>
            </Link>
            <View className="min-w-0 flex-1 gap-3">
                <View className="gap-1">
                    <View className="flex-row items-baseline gap-2">
                        <Link href={`/u/${item.author.username}`} asChild>
                            <Text
                                numberOfLines={1}
                                className="shrink font-bold text-sm"
                            >
                                {item.author.username}
                            </Text>
                        </Link>
                        <Text
                            maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                            className="text-muted-foreground text-xs"
                        >
                            {formatTimeAgo(item.created, Date.now())}
                        </Text>
                    </View>
                    <View className="flex-row flex-wrap items-center gap-2">
                        {review ? (
                            <ReviewBadge review={review} />
                        ) : (
                            item.data_type !== 'comment' && (
                                <TypeBadge
                                    dataType={item.data_type}
                                    category={category}
                                />
                            )
                        )}
                        {reference && <ReferenceBadge reference={reference} />}
                    </View>
                </View>
                {item.data_type === 'article' && <ArticleBody data={item} />}
                {item.data_type === 'collection' && (
                    <CollectionBody data={item} />
                )}
                {item.data_type === 'comment' && <CommentBody data={item} />}
                <StatItemGroup>
                    <StatItem>
                        <Icon as={ArrowBigUp} className="size-5" />
                        {item.vote_score}
                    </StatItem>
                    <StatItem
                        onPress={openComments}
                        accessibilityLabel="Коментарі"
                    >
                        <Icon as={MessageCircle} />
                        {commentsCount > 0 ? commentsCount : undefined}
                    </StatItem>
                </StatItemGroup>
            </View>
        </View>
    );
};

export default FeedItem;
