'use client';

import React from 'react';
import BxBxsDownvote from '~icons/bx/bxs-downvote';
import BxBxsUpvote from '~icons/bx/bxs-upvote';
import BxDownvote from '~icons/bx/downvote';
import BxUpvote from '~icons/bx/upvote';

import { useParams } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import vote from '@/services/api/vote/vote';
import useAuth from '@/services/hooks/auth/useAuth';
import useCollection from '@/services/hooks/collections/useCollection';

const CollectionVote = () => {
    const queryClient = useQueryClient();
    const { auth } = useAuth();
    const params = useParams();

    const { data: collection } = useCollection({
        reference: String(params.reference),
    });

    const handleCollectionVote = async (score: -1 | 1) => {
        if (!collection) return;

        const updated = collection?.my_score === score ? 0 : score;

        await vote({
            auth: String(auth),
            slug: collection.reference,
            score: updated,
            content_type: 'collection',
        });

        await queryClient.invalidateQueries({
            queryKey: ['collection', collection.reference, { auth }],
            exact: false,
        });
    };

    return (
        <Card className="flex-1 flex-row items-center justify-between gap-4 p-1">
            <Button
                onClick={() => handleCollectionVote(1)}
                size="icon-md"
                variant="secondary"
                disabled={!auth}
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
                disabled={!auth}
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
