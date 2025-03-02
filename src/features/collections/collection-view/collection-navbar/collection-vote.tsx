import { FC } from 'react';

import BxBxsDownvote from '@/components/icons/bx/BxBxsDownvote';
import BxBxsUpvote from '@/components/icons/bx/BxBxsUpvote';
import BxDownvote from '@/components/icons/bx/BxDownvote';
import BxUpvote from '@/components/icons/bx/BxUpvote';
import { Button, buttonVariants } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';

import AuthModal from '@/features/modals/auth-modal/auth-modal.component';

import useSession from '@/services/hooks/auth/use-session';
import useVote from '@/services/hooks/vote/useVote';
import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/utils';

interface Props {
    collection: API.Collection;
}

const CollectionVote: FC<Props> = ({ collection }) => {
    const { openModal } = useModalContext();
    const { user: loggedUser } = useSession();

    const mutation = useVote();

    const currentScore = mutation.variables?.params?.score
        ? mutation.variables?.params?.score
        : collection.my_score;

    const handleCollectionVote = async (score: -1 | 1) => {
        if (!loggedUser) {
            openModal({
                content: <AuthModal type="login" />,
                className: 'max-w-3xl p-0',
                forceModal: true,
            });

            return;
        }

        const updated = currentScore === score ? 0 : score;

        mutation.mutate({
            params: {
                slug: collection.reference,
                score: updated,
                content_type: 'collection',
            },
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
                    <BxBxsUpvote className="text-success" />
                ) : (
                    <BxUpvote />
                )}
            </Button>
            <Label
                className={
                    collection.vote_score > 0
                        ? 'text-success'
                        : collection.vote_score === 0
                          ? 'text-foreground'
                          : 'text-destructive'
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
                    <BxBxsDownvote className="text-destructive" />
                ) : (
                    <BxDownvote />
                )}
            </Button>
        </Card>
    );
};

export default CollectionVote;
