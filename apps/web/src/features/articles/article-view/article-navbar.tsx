'use client';

import { useArticleBySlug, useSession } from '@hikka/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FC, Fragment, useCallback } from 'react';
import { toast } from 'sonner';

import IconamoonCommentFill from '@/components/icons/iconamoon/IconamoonCommentFill';
import { MaterialSymbolsLinkRounded } from '@/components/icons/material-symbols/MaterialSymbolsLinkRounded';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { COMMENT_DECLENSIONS } from '@/utils/constants/common';
import { getDeclensionWord } from '@/utils/i18n/declension';

import ArticleMenu from './components/article-navbar/article-menu';
import ArticleVote from './components/article-navbar/article-vote';

interface Props {}

const ArticleNavbar: FC<Props> = () => {
    const params = useParams();
    const { user: loggedUser, isAdmin, isModerator } = useSession();

    const { data: article } = useArticleBySlug({
        slug: String(params.slug),
    });

    const handleCopyLink = useCallback(() => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Ви успішно скопіювали посилання.');
    }, [params.slug]);

    if (article?.category === 'system') {
        if (loggedUser?.role !== 'admin' && loggedUser?.role !== 'moderator') {
            return null;
        }
    }

    return (
        <div className="sticky bottom-3 z-10 mx-auto flex w-fit md:bottom-4">
            <Card className="flex-row gap-2 border-none bg-secondary/60 px-3 py-2 backdrop-blur-xl">
                {article?.category !== 'system' && (
                    <Fragment>
                        <ArticleVote article={article!} />
                        <Button asChild size="md" variant="ghost">
                            <Link href={`/comments/article/${params.slug}`}>
                                <IconamoonCommentFill className="size-4" />
                                <span>
                                    {article?.comments_count}{' '}
                                    <span className="hidden sm:inline">
                                        {getDeclensionWord(
                                            article?.comments_count ?? 0,
                                            COMMENT_DECLENSIONS,
                                        )}
                                    </span>
                                </span>
                            </Link>
                        </Button>
                        <div className="h-full w-px bg-secondary" />
                    </Fragment>
                )}

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={handleCopyLink}
                            size="icon-md"
                            variant="ghost"
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
