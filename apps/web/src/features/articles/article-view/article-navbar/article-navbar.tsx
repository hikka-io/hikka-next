import { type FC, Fragment, useCallback } from 'react';

import { useQuery } from '@tanstack/react-query';
import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

import { getArticleOptions } from '@hikka/api';

import { MaterialSymbolsLinkRounded } from '@/components/icons/material-symbols/MaterialSymbolsLinkRounded';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSession } from '@/features/auth/hooks/use-session';
import { COMMENT_DECLENSIONS } from '@/utils/constants/common';
import { getDeclensionWord } from '@/utils/i18n/declension';
import { Link, useParams } from '@/utils/navigation';

import ArticleMenu from './components/article-menu';
import ArticleVote from './components/article-vote';

type Props = {};

const ArticleNavbar: FC<Props> = () => {
    const params = useParams();
    const { user: loggedUser, isAdmin, isModerator } = useSession();

    const { data: article } = useQuery(
        getArticleOptions({ path: { slug: String(params.slug) } }),
    );

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
            <Card variant="glass" className="flex-row gap-2 border-none px-3 py-2">
                {article?.category !== 'system' && (
                    <Fragment>
                        <ArticleVote article={article!} />
                        <Button asChild size="md" variant="ghost">
                            <Link to={`/comments/article/${params.slug}`}>
                                <MessageCircle className="size-4" />
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
                        <div className="h-full w-px bg-border" />
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
