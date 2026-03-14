'use client';

import { VoteContentType } from '@hikka/client';
import { useCreateVote, useSession } from '@hikka/react';
import { useRouter } from '@/utils/navigation';

interface UseVoteParams {
    contentType: VoteContentType;
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
    const mutation = useCreateVote();

    const currentMyScore =
        mutation.variables?.score !== undefined
            ? mutation.variables.score
            : myScore;

    const optimisticVoteScore = voteScore + (currentMyScore - myScore);

    const handleVote = (score: -1 | 1) => {
        if (!loggedUser) {
            router.push('/login');
            return;
        }

        const updated = currentMyScore === score ? 0 : score;

        mutation.mutate({
            contentType,
            slug,
            score: updated,
        });
    };

    return { currentMyScore, optimisticVoteScore, handleVote };
}
