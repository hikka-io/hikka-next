import { VoteContentType } from '@hikka/client';

export interface UseVoteStatusParams {
    contentType: VoteContentType;
    slug: string;
}

export interface UseVoteMutationParams {
    contentType: VoteContentType;
    slug: string;
    score: number;
}
