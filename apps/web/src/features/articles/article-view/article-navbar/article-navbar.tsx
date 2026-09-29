import { type FC, Fragment } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getArticleOptions, VoteContentTypeEnum } from '@hikka/api';

import CommentsCountButton from '@/components/action-buttons/comments-count-button';
import VoteButton from '@/components/action-buttons/vote-button';
import Card from '@/components/ui/card';
import { useSession } from '@/services/session';
import { cn } from '@/utils/cn';
import { useParams } from '@/utils/navigation';

import ArticleViewActionsMenu from '../article-actions-menu';

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

    const { slug, my_score: myScore, vote_score: voteScore } = article!;

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
                        <VoteButton
                            variant="card"
                            contentType={VoteContentTypeEnum.ARTICLE}
                            slug={slug}
                            myScore={myScore}
                            voteScore={voteScore}
                        />
                        <CommentsCountButton
                            to={`/comments/article/${params.slug}`}
                            count={article?.comments_count}
                            iconClassName="size-4"
                        />
                        <div className="hidden h-full w-px bg-border md:block" />
                    </Fragment>
                )}

                <ArticleViewActionsMenu className="hidden md:flex" />
            </Card>
        </div>
    );
};

export default ArticleViewNavbar;
