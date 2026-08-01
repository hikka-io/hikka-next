import { type FC, Fragment } from 'react';

import { useQuery } from '@tanstack/react-query';
import { MessageCircle } from 'lucide-react';

import { getArticleOptions } from '@hikka/api';

import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { useSession } from '@/features/auth/hooks/use-session';
import { cn } from '@/utils/cn';
import { COMMENT_DECLENSIONS } from '@/utils/constants/common';
import { getDeclensionWord } from '@/utils/i18n/declension';
import { Link, useParams } from '@/utils/navigation';

import ArticleActionsMenu from '../article-actions-menu';
import ArticleVote from './components/article-vote';

type Props = {};

const ArticleNavbar: FC<Props> = () => {
    const params = useParams();
    const { user: loggedUser } = useSession();

    const { data: article } = useQuery(
        getArticleOptions({ path: { slug: String(params.slug) } }),
    );

    const isSystem = article?.category === 'system';

    if (isSystem) {
        if (loggedUser?.role !== 'admin' && loggedUser?.role !== 'moderator') {
            return null;
        }
    }

    return (
        <div
            className={cn(
                'sticky bottom-[calc(var(--tab-bar-height)+1rem)] z-10 mx-auto flex w-fit',
                isSystem && 'hidden md:flex',
            )}
        >
            <Card variant="glass" className="flex-row gap-2 px-3 py-2">
                {!isSystem && (
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
                        <div className="hidden h-full w-px bg-border md:block" />
                    </Fragment>
                )}

                <ArticleActionsMenu className="hidden md:flex" />
            </Card>
        </div>
    );
};

export default ArticleNavbar;
