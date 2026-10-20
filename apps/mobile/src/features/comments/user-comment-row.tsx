import type { FC } from 'react';

import { useRouter } from 'expo-router';
import { CornerDownRight, MessagesSquare } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import type { CommentResponse, ContentTypeEnum } from '@hikka/api';
import { CONTENT_TYPES, contentPath } from '@hikka/core';

import { useOpenLink } from '@/components/markdown';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { StatItem } from '@/components/ui/stat-item';
import { Text } from '@/components/ui/text';
import { siteUrl } from '@/utils/site-origin';

import CommentItem from './comment-item';
import { threadHref } from './comment-routes';

type CommentPreview = { slug?: string; title?: string };

type Props = {
    comment: CommentResponse;
};

/** A comment outside its thread (the web's `UserComment`): content and parent links, a link to the thread. */
const UserCommentRow: FC<Props> = ({ comment }) => {
    const router = useRouter();
    const openLink = useOpenLink();
    const preview = comment.preview as CommentPreview;
    const slug = preview.slug ?? '';
    const contentType = comment.content_type as ContentTypeEnum;

    const openThread = () =>
        router.push(threadHref(comment.content_type, slug, comment.reference));

    const meta = (
        <>
            {comment.parent && (
                <Pressable
                    accessibilityRole="link"
                    onPress={() =>
                        router.push(
                            threadHref(
                                comment.content_type,
                                slug,
                                comment.parent ?? undefined,
                            ),
                        )
                    }
                    className="-my-2 min-h-11 justify-center active:opacity-70"
                >
                    <Badge variant="secondary">
                        <Icon as={CornerDownRight} className="size-3.5" />
                        Відповідь
                    </Badge>
                </Pressable>
            )}
            {slug && (
                <Pressable
                    accessibilityRole="link"
                    onPress={() =>
                        openLink(siteUrl(contentPath(contentType, slug)))
                    }
                    className="-my-2 min-h-11 max-w-full shrink justify-center active:opacity-70"
                >
                    <Badge variant="secondary" className="max-w-full">
                        <Text numberOfLines={1} className="shrink">
                            {contentType === 'edit'
                                ? `${CONTENT_TYPES[contentType].title_ua} #${slug}`
                                : (preview.title ?? slug)}
                        </Text>
                    </Badge>
                </Pressable>
            )}
        </>
    );

    return (
        <View className="px-4 pb-6">
            <CommentItem
                comment={comment}
                slug={slug}
                inThread={false}
                meta={meta}
                onReadMore={openThread}
                replies={
                    <StatItem onPress={openThread}>
                        <Icon as={MessagesSquare} />
                        Гілка
                    </StatItem>
                }
            />
        </View>
    );
};

export default UserCommentRow;
