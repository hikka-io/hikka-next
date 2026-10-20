import type { FC } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react-native';
import { View } from 'react-native';
import { useResolveClassNames } from 'uniwind';

import { setVoteMutation, type VoteContentTypeEnum } from '@hikka/api';
import {
    MUTATION_META_SKIP_ERROR_TOAST,
    nextVoteScore,
    optimisticVote,
} from '@hikka/core';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';
import { useSession } from '@/features/auth';
import { applyVoteMutation } from '@/utils/api/invalidate-content-state';
import { cn } from '@/utils/cn';
import { toastApiError } from '@/utils/offline-toast';

const VOTE_ERROR = 'Не вдалося зберегти голос';

type Props = {
    contentType: VoteContentTypeEnum;
    slug: string;
    myScore: number;
    voteScore: number;
};

/** The web's card `VoteButton`: up, the score, down; the viewer's vote shows before the server answers. */
const VoteButton: FC<Props> = ({ contentType, slug, myScore, voteScore }) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { hasToken } = useSession();
    const { color: success } = useResolveClassNames('text-success-foreground');
    const { color: destructive } = useResolveClassNames(
        'text-destructive-foreground',
    );

    const mutation = useMutation({
        ...setVoteMutation(),
        // Votes on one target run one after another, so the last tap is the vote that stays.
        scope: { id: `vote-${contentType}-${slug}` },
        meta: MUTATION_META_SKIP_ERROR_TOAST,
        onSuccess: (data, { path }) => {
            void applyVoteMutation(queryClient, path, data);
        },
        onError: (error) => {
            void Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Error,
            );
            toastApiError(error, VOTE_ERROR);
        },
    });

    const current = optimisticVote(
        myScore,
        voteScore,
        mutation.isError ? undefined : mutation.variables?.body.score,
    );

    const vote = (pressed: -1 | 1) => {
        if (!hasToken) {
            router.push('/login');
            return;
        }

        void Haptics.selectionAsync();
        mutation.mutate({
            path: { content_type: contentType, slug },
            body: { score: nextVoteScore(current.myScore, pressed) },
        });
    };

    const up = current.myScore === 1;
    const down = current.myScore === -1;

    return (
        <View className="flex-row items-center self-start rounded-md bg-secondary">
            <Button
                variant="ghost"
                size="icon-md"
                accessibilityLabel="Подобається"
                accessibilityState={{ selected: up }}
                onPress={() => vote(1)}
            >
                <Icon
                    as={ArrowBigUp}
                    fill={up && typeof success === 'string' ? success : 'none'}
                    className={cn(
                        'size-5',
                        up
                            ? 'text-success-foreground'
                            : 'text-muted-foreground',
                    )}
                />
            </Button>
            <Text
                maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                accessibilityLabel={`Рейтинг ${current.voteScore}`}
                className={cn(
                    'min-w-6 text-center font-medium text-sm tabular-nums',
                    current.voteScore > 0
                        ? 'text-success-foreground'
                        : current.voteScore < 0
                          ? 'text-destructive-foreground'
                          : 'text-muted-foreground',
                )}
            >
                {current.voteScore}
            </Text>
            <Button
                variant="ghost"
                size="icon-md"
                accessibilityLabel="Не подобається"
                accessibilityState={{ selected: down }}
                onPress={() => vote(-1)}
            >
                <Icon
                    as={ArrowBigDown}
                    fill={
                        down && typeof destructive === 'string'
                            ? destructive
                            : 'none'
                    }
                    className={cn(
                        'size-5',
                        down
                            ? 'text-destructive-foreground'
                            : 'text-muted-foreground',
                    )}
                />
            </Button>
        </View>
    );
};

export default VoteButton;
