'use client';

import { ArticleBaseResponse, ContentTypeEnum } from '@hikka/client';
import { useCreateVote, useSession } from '@hikka/react';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';

import { cn } from '@/utils/cn';

interface Props {
    article: ArticleBaseResponse;
}

const ArticleVote: FC<Props> = ({ article }) => {
    const { user: loggedUser } = useSession();
    const router = useRouter();

    const mutation = useCreateVote();

    const currentScore = mutation.variables?.score
        ? mutation.variables?.score
        : article.my_score;

    const handleArticleVote = async (score: -1 | 1) => {
        if (!loggedUser) {
            router.push('/login');
            return;
        }

        const updated = currentScore === score ? 0 : score;

        mutation.mutate({
            contentType: ContentTypeEnum.ARTICLE,
            slug: article.slug,
            score: updated,
        });
    };

    return (
        <Card
            className={buttonVariants({
                variant: 'secondary',
                size: 'md',
                className: 'flex-row p-0 overflow-hidden border-none gap-0',
            })}
        >
            <Button
                onClick={() => handleArticleVote(1)}
                variant={'ghost'}
                size="icon-md"
                className={cn(
                    'opacity-60 group-hover:opacity-100 font-normal',
                    currentScore === 1
                        ? 'text-success-foreground opacity-100'
                        : 'text-muted-foreground',
                )}
            >
                <ArrowBigUp
                    className={cn(
                        '!size-5',
                        currentScore === 1 && 'fill-success-foreground',
                    )}
                />
            </Button>
            <Label
                className={
                    article.vote_score > 0
                        ? 'text-success-foreground'
                        : article.vote_score === 0
                          ? 'text-foreground'
                          : 'text-destructive-foreground'
                }
            >
                {article.vote_score}
            </Label>
            <Button
                onClick={() => handleArticleVote(-1)}
                variant={'ghost'}
                size="icon-md"
                className={cn(
                    'opacity-60 group-hover:opacity-100 font-normal',
                    currentScore === -1
                        ? 'text-destructive-foreground opacity-100'
                        : 'text-muted-foreground',
                )}
            >
                <ArrowBigDown
                    className={cn(
                        '!size-5',
                        currentScore === -1 && 'fill-destructive-foreground',
                    )}
                />
            </Button>
        </Card>
    );
};

export default ArticleVote;
