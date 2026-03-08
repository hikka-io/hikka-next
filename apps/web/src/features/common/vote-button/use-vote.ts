'use client';

import { VoteContentType } from '@hikka/client';
import { useCreateVote, useSession } from '@hikka/react';
import { useRouter } from 'next/navigation';

interface UseVoteParams {
    contentType: VoteContentType;
    slug: string;
    myScore: number;
}

export function useVote({ contentType, slug, myScore }: UseVoteParams) {
    const { user: loggedUser } = useSession();
    const router = useRouter();
    const mutation = useCreateVote();

    const currentScore = mutation.variables?.score
        ? mutation.variables.score
        : myScore;

    const handleVote = (score: -1 | 1) => {
        if (!loggedUser) {
            router.push('/login');
            return;
        }

        const updated = currentScore === score ? 0 : score;

        mutation.mutate({
            contentType,
            slug,
            score: updated,
        });
    };

    return { currentScore, handleVote };
}
