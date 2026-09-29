import { type FC, Fragment } from 'react';

import { useQuery } from '@tanstack/react-query';
import { MessageCircle } from 'lucide-react';

import { getArticleOptions } from '@hikka/api';

import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { useSession } from '@/features/auth/hooks/use-session';
import { cn } from '@/utils/cn';
import { getDeclensionWord } from '@/utils/i18n/declension';
import { COMMENT_FORMS } from '@/utils/i18n/word-forms';
import { Link, useParams } from '@/utils/navigation';

import ArticleViewActionsMenu from '../article-actions-menu';
import ArticleVote from './article-vote';

type Props = {};

const ArticleViewNavbar: FC<Props> = () => {
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
                        <Button
                            size="md"
                            variant="ghost"
                            render={
                                <Link to={`/comments/article/${params.slug}`} />
                            }
                        >
                            <MessageCircle className="size-4" />
                            <span>
                                {article?.comments_count}{' '}
                                <span className="hidden sm:inline">
                                    {getDeclensionWord(
                                        article?.comments_count ?? 0,
                                        COMMENT_FORMS,
                                    )}
                                </span>
                            </span>
                        </Button>
                        <div className="hidden h-full w-px bg-border md:block" />
                    </Fragment>
                )}

                <ArticleViewActionsMenu className="hidden md:flex" />
            </Card>
        </div>
    );
};

export default ArticleViewNavbar;
