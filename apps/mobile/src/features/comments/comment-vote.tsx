import type { FC } from 'react';

import { ArrowBigDown, ArrowBigUp } from 'lucide-react-native';
import { View } from 'react-native';
import { useCSSVariable } from 'uniwind';

import type { CommentResponse } from '@hikka/api';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';
import { cn } from '@/utils/cn';

import { useCommentVote } from './use-comment-mutations';

type Props = {
    comment: CommentResponse;
};

/** The web's `VoteButton` in a comment footer: up, score, down. */
const CommentVote: FC<Props> = ({ comment }) => {
    const vote = useCommentVote(comment);
    const { my_score: mine, vote_score: score } = comment;
    const up = useCSSVariable('--color-success-foreground');
    const down = useCSSVariable('--color-destructive-foreground');
    const fill = (color: unknown) =>
        typeof color === 'string' ? color : 'none';

    return (
        <View className="flex-row items-center">
            <Button
                variant="ghost"
                size="icon-sm"
                accessibilityLabel="Подобається"
                accessibilityState={{ selected: mine === 1 }}
                onPress={() => vote(1)}
            >
                <Icon
                    as={ArrowBigUp}
                    fill={mine === 1 ? fill(up) : 'none'}
                    className={cn(
                        'size-5',
                        mine === 1
                            ? 'text-success-foreground'
                            : 'text-muted-foreground',
                    )}
                />
            </Button>
            <Text
                maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                accessibilityLabel={`Рейтинг ${score}`}
                className={cn(
                    'min-w-4 text-center font-medium text-sm tabular-nums',
                    score > 0
                        ? 'text-success-foreground'
                        : score < 0
                          ? 'text-destructive-foreground'
                          : 'text-muted-foreground',
                )}
            >
                {score}
            </Text>
            <Button
                variant="ghost"
                size="icon-sm"
                accessibilityLabel="Не подобається"
                accessibilityState={{ selected: mine === -1 }}
                onPress={() => vote(-1)}
            >
                <Icon
                    as={ArrowBigDown}
                    fill={mine === -1 ? fill(down) : 'none'}
                    className={cn(
                        'size-5',
                        mine === -1
                            ? 'text-destructive-foreground'
                            : 'text-muted-foreground',
                    )}
                />
            </Button>
        </View>
    );
};

export default CommentVote;
