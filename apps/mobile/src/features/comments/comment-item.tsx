import type { FC, ReactNode } from 'react';

import { useRouter } from 'expo-router';
import { Reply } from 'lucide-react-native';
import { View } from 'react-native';

import type { CommentResponse } from '@hikka/api';

import { MDViewer } from '@/components/markdown';
import ReviewBadge from '@/components/review-badge';
import TextExpand from '@/components/text-expand';
import { Icon } from '@/components/ui/icon';
import { StatItem, StatItemGroup } from '@/components/ui/stat-item';
import { Text } from '@/components/ui/text';
import { useSession } from '@/features/auth';

import CommentAuthor from './comment-author';
import CommentAvatar from './comment-avatar';
import CommentMenu from './comment-menu';
import { composerHref } from './comment-routes';
import CommentVote from './comment-vote';

export const COMMENT_TEXT_CLASS = 'text-[15px] leading-[22px] text-foreground';
const COMMENT_LINES = 8;

type Props = {
    comment: CommentResponse;
    slug: string;
    /** The replies control (collapse, expand or open the thread), after vote and reply. */
    replies?: ReactNode;
    /** A user's comment list cannot show an edit in place; it hides edit and reply. */
    inThread?: boolean;
    /** Chips under the author row (the content and parent links of a user's comment). */
    meta?: ReactNode;
    onReadMore?: () => void;
};

/** One comment: avatar, author row, menu, body and footer (the web's `Comment` without its replies). */
const CommentItem: FC<Props> = ({
    comment,
    slug,
    replies,
    inThread = true,
    meta,
    onReadMore,
}) => {
    const router = useRouter();
    const { user } = useSession();

    const reply = () => {
        if (!user) {
            router.push('/login');
            return;
        }
        router.push(
            composerHref({
                contentType: comment.content_type,
                slug,
                reply: comment.reference,
            }),
        );
    };

    return (
        <View className="flex-row gap-3">
            <CommentAvatar author={comment.author} />
            <View className="min-w-0 flex-1 gap-2">
                <View className="min-h-10 flex-row items-center gap-1">
                    <CommentAuthor
                        author={comment.author}
                        created={comment.created}
                        className="flex-1"
                    />
                    {!comment.hidden && (
                        <View className="-my-1 -mr-3">
                            <CommentMenu
                                comment={comment}
                                slug={slug}
                                editable={inThread}
                            />
                        </View>
                    )}
                </View>
                {(comment.review || meta) && (
                    <View className="flex-row flex-wrap items-center gap-2">
                        {comment.review && (
                            <ReviewBadge review={comment.review} />
                        )}
                        {meta}
                    </View>
                )}
                {comment.hidden || !comment.text ? (
                    <Text className="text-[15px] text-muted-foreground leading-[22px]">
                        Коментар видалено
                    </Text>
                ) : (
                    <TextExpand
                        lines={COMMENT_LINES}
                        textClassName={COMMENT_TEXT_CLASS}
                        contentKey={comment.reference}
                        onReadMore={onReadMore}
                        expandText={onReadMore ? 'Читати далі' : undefined}
                        expandLabel={onReadMore ? 'Читати далі' : undefined}
                    >
                        <MDViewer
                            key={comment.reference}
                            textClassName={COMMENT_TEXT_CLASS}
                        >
                            {comment.text}
                        </MDViewer>
                    </TextExpand>
                )}
                {(!comment.hidden || replies) && (
                    <StatItemGroup className="-ml-2 flex-wrap">
                        {!comment.hidden && <CommentVote comment={comment} />}
                        {!comment.hidden && inThread && (
                            <StatItem onPress={reply}>
                                <Icon as={Reply} />
                                Відповісти
                            </StatItem>
                        )}
                        {replies}
                    </StatItemGroup>
                )}
            </View>
        </View>
    );
};

export default CommentItem;
