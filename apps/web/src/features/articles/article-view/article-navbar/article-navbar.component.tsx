'use client';

import { useArticle, useSession } from '@hikka/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { FC, useCallback } from 'react';

import IconamoonCommentFill from '@/components/icons/iconamoon/IconamoonCommentFill';
import { MaterialSymbolsLinkRounded } from '@/components/icons/material-symbols/MaterialSymbolsLinkRounded';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import ArticleMenu from './article-menu';
import ArticleVote from './article-vote';

interface Props {}

const ArticleNavbar: FC<Props> = () => {
    const params = useParams();
    const { user: loggedUser, isAdmin, isModerator } = useSession();

    const { data: article } = useArticle({
        slug: String(params.slug),
    });

    const handleCopyLink = useCallback(() => {
        navigator.clipboard.writeText(window.location.href);
        enqueueSnackbar('Ви успішно скопіювали посилання.', {
            variant: 'success',
        });
    }, [params.slug]);

    if (article?.category === 'system') {
        if (loggedUser?.role !== 'admin' && loggedUser?.role !== 'moderator') {
            return null;
        }
    }

    return (
        <div className="sticky bottom-2 z-10 flex justify-center">
            <Card className="flex-row gap-2 border-none bg-background/60 p-2 backdrop-blur-xl">
                {article?.category !== 'system' && (
                    <ArticleVote article={article!} />
                )}

                {article?.category !== 'system' && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button asChild size="md" variant="secondary">
                                <Link href={`/comments/article/${params.slug}`}>
                                    <IconamoonCommentFill className="size-4" />
                                    {article?.comments_count}
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Коментарі</TooltipContent>
                    </Tooltip>
                )}

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={handleCopyLink}
                            size="icon-md"
                            variant="secondary"
                        >
                            <MaterialSymbolsLinkRounded className="size-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Поширити</TooltipContent>
                </Tooltip>
                {(loggedUser?.username === article?.author.username ||
                    isAdmin() ||
                    isModerator()) && <ArticleMenu article={article!} />}
            </Card>
        </div>
    );
};

export default ArticleNavbar;
