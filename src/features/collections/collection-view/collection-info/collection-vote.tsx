'use client';

import { useParams } from 'next/navigation';
import BxBxsDownvote from '~icons/bx/bxs-downvote';
import BxBxsUpvote from '~icons/bx/bxs-upvote';
import BxDownvote from '~icons/bx/downvote';
import BxUpvote from '~icons/bx/upvote';

import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';

import useSession from '@/services/hooks/auth/use-session';
import useCollection from '@/services/hooks/collections/use-collection';
import useVote from '@/services/hooks/vote/useVote';

const CollectionVote = () => {
    const { user: loggedUser } = useSession();
    const params = useParams();

    const { data: collection } = useCollection({
        reference: String(params.reference),
    });

    const mutation = useVote();

    const handleCollectionVote = async (score: -1 | 1) => {
        if (!collection) return;

        const updated = collection?.my_score === score ? 0 : score;

        mutation.mutate({
            params: {
                slug: collection.reference,
                score: updated,
                content_type: 'collection',
            },
        });
    };

    return (
        <Card className="flex-1 flex-row items-center justify-between gap-4 p-1">
            <Button
                onClick={() => handleCollectionVote(1)}
                size="icon-md"
                variant="secondary"
                disabled={!loggedUser}
            >
                {collection?.my_score === 1 ? (
                    <BxBxsUpvote className="text-success" />
                ) : (
                    <BxUpvote />
                )}
            </Button>
            <Label>{collection?.vote_score}</Label>
            <Button
                onClick={() => handleCollectionVote(-1)}
                size="icon-md"
                variant="secondary"
                disabled={!loggedUser}
            >
                {collection?.my_score === -1 ? (
                    <BxBxsDownvote className="text-destructive" />
                ) : (
                    <BxDownvote />
                )}
            </Button>
        </Card>
    );
};

export default CollectionVote;
