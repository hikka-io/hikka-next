import type { FC } from 'react';

import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { ChevronUp, CirclePlus } from 'lucide-react-native';
import { View } from 'react-native';

import { getDeclensionWord, REPLY_FORMS } from '@hikka/core';

import { Icon } from '@/components/ui/icon';
import { StatItem } from '@/components/ui/stat-item';

import CommentItem from './comment-item';
import { threadHref } from './comment-routes';
import type { CommentRow as Row } from './comment-rows';
import { useCommentTreeStore } from './comment-tree-store';

const GUTTER = 16;
const INDENT = 16;
/** Where an elbow meets the avatar's vertical centre (the 40 pt avatar sits 2 pt high in its 44 pt box). */
const AVATAR_CENTER = 18;
const ELBOW_HEIGHT = 12;
/** A link-out row: the centre of its 44 pt touch target. */
const LINK_CENTER = 22;

type GuidesProps = {
    row: Row;
    center: number;
};

const Guides: FC<GuidesProps> = ({ row, center }) => {
    const { depth, guides, hasNext } = row;
    const elbowLeft = GUTTER + (depth - 1) * INDENT;

    return (
        <>
            {guides.map((through, level) =>
                through ? (
                    <View
                        // biome-ignore lint/suspicious/noArrayIndexKey: one line per indentation level.
                        key={level}
                        pointerEvents="none"
                        className="absolute top-0 bottom-0 w-0.5 bg-border"
                        style={{ left: GUTTER + level * INDENT }}
                    />
                ) : null,
            )}
            {depth > 0 && (
                <>
                    <View
                        pointerEvents="none"
                        className="absolute top-0 w-0.5 bg-border"
                        style={
                            hasNext
                                ? { left: elbowLeft, bottom: 0 }
                                : {
                                      left: elbowLeft,
                                      height: center - ELBOW_HEIGHT,
                                  }
                        }
                    />
                    <View
                        pointerEvents="none"
                        className="absolute rounded-bl-xl border-border border-b-2 border-l-2"
                        style={{
                            left: elbowLeft,
                            top: center - ELBOW_HEIGHT,
                            width: INDENT,
                            height: ELBOW_HEIGHT,
                        }}
                    />
                </>
            )}
        </>
    );
};

type Props = {
    row: Row;
    slug: string;
};

/** One FlashList row of a thread: a comment or the link to the rest of a thread, with its guides. */
const CommentRow: FC<Props> = ({ row, slug }) => {
    const router = useRouter();
    const setExpanded = useCommentTreeStore((state) => state.setExpanded);
    const { node } = row;
    const openThread = () =>
        router.push(threadHref(node.content_type, slug, node.reference));

    if (row.type === 'more') {
        return (
            <View className="px-4 pb-6">
                <Guides row={row} center={LINK_CENTER} />
                <View
                    className="flex-row"
                    style={{ paddingLeft: row.depth * INDENT }}
                >
                    <StatItem onPress={openThread}>
                        <Icon as={CirclePlus} />
                        Більше відповідей
                    </StatItem>
                </View>
            </View>
        );
    }

    const replyCount = Math.max(row.loadedReplies, node.total_replies ?? 0);
    const toggle = () => {
        void Haptics.selectionAsync();
        setExpanded(node.reference, !row.expanded);
    };

    const replyLabel = `${replyCount} ${getDeclensionWord(replyCount, REPLY_FORMS)}`;
    const replies =
        row.loadedReplies > 0 ? (
            <StatItem
                onPress={toggle}
                accessibilityLabel={replyLabel}
                accessibilityHint={
                    row.expanded ? 'Згорнути відповіді' : 'Показати відповіді'
                }
                accessibilityState={{ expanded: row.expanded }}
            >
                <Icon as={row.expanded ? ChevronUp : CirclePlus} />
                {row.expanded ? 'Згорнути' : replyLabel}
            </StatItem>
        ) : row.missingReplies > 0 ? (
            <StatItem onPress={openThread}>
                <Icon as={CirclePlus} />
                {replyLabel}
            </StatItem>
        ) : undefined;

    return (
        <View className="px-4 pb-6">
            <Guides row={row} center={AVATAR_CENTER} />
            {row.threadLine && (
                <View
                    pointerEvents="none"
                    className="absolute bottom-0 w-0.5 bg-border"
                    style={{
                        left: GUTTER + row.depth * INDENT,
                        top: AVATAR_CENTER,
                    }}
                />
            )}
            <View style={{ paddingLeft: row.depth * INDENT }}>
                <CommentItem comment={node} slug={slug} replies={replies} />
            </View>
        </View>
    );
};

export default CommentRow;
