import type { FC } from 'react';

import { useRouter } from 'expo-router';
import { CirclePlus, MessageSquarePlus } from 'lucide-react-native';
import { View } from 'react-native';

import type { CommentContentTypeEnum, CommentResponse } from '@hikka/api';
import { buildCommentTree, getDeclensionWord, REPLY_FORMS } from '@hikka/core';

import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Header, HeaderTitle } from '@/components/ui/header';
import { Icon } from '@/components/ui/icon';
import { StatItem } from '@/components/ui/stat-item';
import { useSession } from '@/features/auth';
import { useInfiniteList } from '@/utils/api/use-infinite-list';

import CommentItem from './comment-item';
import { composerHref, threadHref } from './comment-routes';
import CommentSkeleton from './comment-skeleton';
import { COMMENT_PREVIEW_SIZE, commentListOptions } from './queries';

type Props = {
    contentType: CommentContentTypeEnum;
    slug: string;
    commentsCount?: number;
    /** Below the fold: the list loads once the section nears the viewport. */
    enabled: boolean;
};

/** The detail page's comment block: the latest comments, the count and the way to the full discussion. */
const CommentsPreview: FC<Props> = ({
    contentType,
    slug,
    commentsCount,
    enabled,
}) => {
    const router = useRouter();
    const { hasToken } = useSession();
    const options = {
        ...commentListOptions(contentType, slug, {}, true),
        enabled,
    };
    const { items, error, onRetry } = useInfiniteList<CommentResponse>(options);
    const roots = items ? buildCommentTree(items) : undefined;
    const all = threadHref(contentType, slug);

    const compose = () =>
        router.push(hasToken ? composerHref({ contentType, slug }) : '/login');

    const body = () => {
        if (error && !items) {
            return (
                <ErrorState variant="inline" error={error} onRetry={onRetry} />
            );
        }

        if (!roots) {
            const count =
                commentsCount === undefined
                    ? COMMENT_PREVIEW_SIZE
                    : Math.min(
                          Math.max(commentsCount, 1),
                          COMMENT_PREVIEW_SIZE,
                      );

            return Array.from({ length: count }, (_, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders.
                <CommentSkeleton key={index} />
            ));
        }

        if (roots.length === 0) {
            return (
                <EmptyState
                    bordered
                    size="sm"
                    icon={<Icon as={MessageSquarePlus} />}
                    title="Коментарів не знайдено"
                    description="Ви можете розпочати обговорення першим"
                    action={
                        <Button size="md" onPress={compose}>
                            Написати коментар
                        </Button>
                    }
                />
            );
        }

        return (
            <>
                {roots.slice(0, COMMENT_PREVIEW_SIZE).map((comment) => {
                    const replies = comment.total_replies ?? 0;

                    return (
                        <CommentItem
                            key={comment.reference}
                            comment={comment}
                            slug={slug}
                            replies={
                                replies > 0 ? (
                                    <StatItem
                                        onPress={() =>
                                            router.push(
                                                threadHref(
                                                    contentType,
                                                    slug,
                                                    comment.reference,
                                                ),
                                            )
                                        }
                                    >
                                        <Icon as={CirclePlus} />
                                        {`${replies} ${getDeclensionWord(replies, REPLY_FORMS)}`}
                                    </StatItem>
                                ) : undefined
                            }
                        />
                    );
                })}
                <View className="flex-row gap-2">
                    <Button
                        variant="outline"
                        size="md"
                        containerClassName="flex-1"
                        className="w-full"
                        onPress={compose}
                    >
                        <Icon as={MessageSquarePlus} />
                        Написати
                    </Button>
                    <Button
                        variant="secondary"
                        size="md"
                        containerClassName="flex-1"
                        className="w-full"
                        onPress={() => router.push(all)}
                    >
                        Переглянути всі
                    </Button>
                </View>
            </>
        );
    };

    return (
        <View className="gap-4">
            <Header>
                <HeaderTitle href={all} count={commentsCount}>
                    Обговорення
                </HeaderTitle>
            </Header>
            <View className="gap-6">{body()}</View>
        </View>
    );
};

export default CommentsPreview;
