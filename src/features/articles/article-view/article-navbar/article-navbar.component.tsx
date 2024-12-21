'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { FC, useCallback } from 'react';
import IconamoonCommentFill from '~icons/iconamoon/comment-fill';
import MaterialSymbolsLinkRounded from '~icons/material-symbols/link-rounded';

import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import useArticle from '@/services/hooks/articles/use-article';
import useSession from '@/services/hooks/auth/use-session';

import ArticleMenu from './article-menu';
import ArticleVote from './article-vote';

interface Props {}

const ArticleNavbar: FC<Props> = () => {
    const params = useParams();
    const { user: loggedUser } = useSession();

    const { data: article } = useArticle({
        slug: String(params.slug),
    });

    if (article?.category === 'system') {
        if (loggedUser?.role !== 'admin' && loggedUser?.role !== 'moderator') {
            return null;
        }
    }

    const handleCopyLink = useCallback(() => {
        navigator.clipboard.writeText(
            `${process.env.NEXT_PUBLIC_SITE_URL}/articles/${params.slug}`,
        );
        enqueueSnackbar('Ви успішно скопіювали посилання.', {
            variant: 'success',
        });
    }, [params.slug]);

    return (
        <div className="flex justify-center sticky bottom-2">
            <Card className="flex-row backdrop-blur-sm gap-2">
                {article?.category !== 'system' && (
                    <ArticleVote article={article!} />
                )}

                {article?.category !== 'system' && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button asChild size="md" variant="outline">
                                <Link
                                    href={
                                        '/comments' +
                                        '/article' +
                                        '/' +
                                        params.slug
                                    }
                                >
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
                            variant="outline"
                        >
                            <MaterialSymbolsLinkRounded className="size-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Поширити</TooltipContent>
                </Tooltip>
                <ArticleMenu article={article!} />
            </Card>
        </div>
    );
};

export default ArticleNavbar;
