import { useMutation, useQueryClient } from '@tanstack/react-query';

import { setVoteMutation, type VoteContentTypeEnum } from '@hikka/api';
import { nextVoteScore, optimisticVote } from '@hikka/core';

import { useSession } from '@/services/session';
import { applyVoteMutation } from '@/utils/api/invalidate-content-state';
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
            applyVoteMutation(queryClient, path, data);
        },
    });

    const { myScore: currentMyScore, voteScore: optimisticVoteScore } =
        optimisticVote(myScore, voteScore, mutation.variables?.body?.score);

    const handleVote = (score: -1 | 1) => {
        if (!loggedUser) {
            router.push('/login');
            return;
        }

        mutation.mutate({
            path: { content_type: contentType, slug },
            body: { score: nextVoteScore(currentMyScore, score) },
        });
    };

    return { currentMyScore, optimisticVoteScore, handleVote };
}
