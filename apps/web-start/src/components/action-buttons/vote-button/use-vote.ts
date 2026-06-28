import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    getVoteQueryKey,
    setVoteMutation,
    type VoteContentTypeEnum,
} from '@hikka/api';

import { useSession } from '@/features/auth/hooks/use-session';
import { invalidateVote } from '@/utils/api/invalidate-content-state';
import { useRouter } from '@/utils/navigation';

interface UseVoteParams {
    contentType: VoteContentTypeEnum;
    slug: string;
    myScore: number;
    voteScore: number;
}

export function useVote({
    contentType,
    slug,
    myScore,
    voteScore,
}: UseVoteParams) {
    const { user: loggedUser } = useSession();
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...setVoteMutation(),
        onSuccess: (data, { path }) => {
            queryClient.setQueryData(
                getVoteQueryKey({
                    path: { content_type: path.content_type, slug: path.slug },
                }),
                data,
            );
            invalidateVote(queryClient);
        },
    });

    const pendingScore = mutation.variables?.body?.score;

    const currentMyScore = pendingScore !== undefined ? pendingScore : myScore;

    const optimisticVoteScore = voteScore + (currentMyScore - myScore);

    const handleVote = (score: -1 | 1) => {
        if (!loggedUser) {
            router.push('/login');
            return;
        }

        const updated = currentMyScore === score ? 0 : score;

        mutation.mutate({
            path: { content_type: contentType, slug },
            body: { score: updated },
        });
    };

    return { currentMyScore, optimisticVoteScore, handleVote };
}
