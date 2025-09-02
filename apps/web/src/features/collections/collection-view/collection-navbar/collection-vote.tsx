'use client';

import {
    CollectionContent,
    CollectionResponse,
    ContentTypeEnum,
} from '@hikka/client';
import { useCreateVote, useSession } from '@hikka/react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

import BxBxsDownvote from '@/components/icons/bx/BxBxsDownvote';
import BxBxsUpvote from '@/components/icons/bx/BxBxsUpvote';
import BxDownvote from '@/components/icons/bx/BxDownvote';
import BxUpvote from '@/components/icons/bx/BxUpvote';
import { Button, buttonVariants } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';

import { cn } from '@/utils/utils';

interface Props {
    collection: CollectionResponse<CollectionContent>;
}

const CollectionVote: FC<Props> = ({ collection }) => {
    const { user: loggedUser } = useSession();
    const router = useRouter();

    const mutation = useCreateVote();

    const currentScore = mutation.variables?.score
        ? mutation.variables?.score
        : collection.my_score;

    const handleCollectionVote = async (score: -1 | 1) => {
        if (!loggedUser) {
            router.push('/login');
            return;
        }

        const updated = currentScore === score ? 0 : score;

        mutation.mutate({
            contentType: ContentTypeEnum.COLLECTION,
            slug: collection.reference,
            score: updated,
        });
    };

    return (
        <Card
            className={buttonVariants({
                variant: 'secondary',
                size: 'md',
                className: 'flex-row p-0 overflow-hidden border-none',
            })}
        >
            <Button
                onClick={() => handleCollectionVote(1)}
                variant={'ghost'}
                size="icon-md"
                className={cn(
                    ' opacity-60 group-hover:opacity-100',
                    currentScore === 1 ? '' : 'text-muted-foreground',
                )}
            >
                {currentScore === 1 ? (
                    <BxBxsUpvote className="text-success-foreground" />
                ) : (
                    <BxUpvote />
                )}
            </Button>
            <Label
                className={
                    collection.vote_score > 0
                        ? 'text-success-foreground'
                        : collection.vote_score === 0
                          ? 'text-foreground'
                          : 'text-destructive-foreground'
                }
            >
                {collection.vote_score}
            </Label>
            <Button
                onClick={() => handleCollectionVote(-1)}
                variant={'ghost'}
                size="icon-md"
                className={cn(
                    'opacity-60 group-hover:opacity-100',
                    currentScore === -1 ? '' : 'text-muted-foreground',
                )}
            >
                {currentScore === -1 ? (
                    <BxBxsDownvote className="text-destructive-foreground" />
                ) : (
                    <BxDownvote />
                )}
            </Button>
        </Card>
    );
};

export default CollectionVote;
