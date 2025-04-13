import { FC } from 'react';

import BxBxsDownvote from '@/components/icons/bx/BxBxsDownvote';
import BxBxsUpvote from '@/components/icons/bx/BxBxsUpvote';
import BxDownvote from '@/components/icons/bx/BxDownvote';
import BxUpvote from '@/components/icons/bx/BxUpvote';
import { Button, buttonVariants } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import useSession from '@/services/hooks/auth/use-session';
import useVote from '@/services/hooks/vote/useVote';
import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/utils';
import AuthModal from '../../../modals/auth-modal/auth-modal.component';

interface Props {
    article: API.Article;
}

const ArticleVote: FC<Props> = ({ article }) => {
    const { openModal } = useModalContext();
    const { user: loggedUser } = useSession();

    const mutation = useVote();

    const currentScore = mutation.variables?.params?.score
        ? mutation.variables?.params?.score
        : article.my_score;

    const handleArticleVote = async (score: -1 | 1) => {
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
                slug: article.slug,
                score: updated,
                content_type: 'article',
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
                onClick={() => handleArticleVote(1)}
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
                    article.vote_score > 0
                        ? 'text-success'
                        : article.vote_score === 0
                          ? 'text-foreground'
                          : 'text-destructive'
                }
            >
                {article.vote_score}
            </Label>
            <Button
                onClick={() => handleArticleVote(-1)}
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

export default ArticleVote;
