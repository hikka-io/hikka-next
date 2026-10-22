import type { FC } from 'react';

import { Eye } from 'lucide-react';
import type { Value } from 'platejs';

import { type ArticlePreviewResponse, ContentTypeEnum } from '@hikka/api';
import { CONTENT_TYPE_LINKS } from '@hikka/core';

import { VoteCommentsFooter } from '@/components/action-buttons';
import { StaticViewer } from '@/components/plate/editor/static-viewer';
import { Badge } from '@/components/ui/badge';
import { StatItem } from '@/components/ui/stat-item';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

import ArticleAuthorCard from '../article-author-card';
import ArticleContentChip from '../article-content-chip';

type Props = {
    article: ArticlePreviewResponse;
    className?: string;
};

const ArticleItem: FC<Props> = ({ article, className }) => {
    const document = article.preview as Value;

    return (
        <article
            className={cn('isolate flex flex-col px-4 sm:px-0', className)}
        >
            <ArticleAuthorCard article={article} className="px-0" />
            <div className="relative flex flex-col gap-4">
                <Link
                    to={`${CONTENT_TYPE_LINKS.article}/${article.slug}`}
                    className="absolute top-0 left-0 z-10 size-full"
                />
                <div className="flex flex-col gap-3">
                    {article.content && (
                        <ArticleContentChip
                            content={article.content}
                            className="relative z-10 self-start"
                        />
                    )}
                    <h2 className="font-bold text-lg leading-7">
                        {article.title}
                    </h2>
                </div>
                {article.tags.length > 0 && (
                    <div className="flex gap-2">
                        {article.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag.name} variant="secondary">
                                {tag.name}
                            </Badge>
                        ))}
                        {article.tags.length > 2 && (
                            <Badge variant="outline">
                                +{article.tags.length - 2}
                            </Badge>
                        )}
                    </div>
                )}
                <StaticViewer value={document} />
            </div>
            <VoteCommentsFooter
                className="py-4"
                commentsCount={article.comments_count}
                commentsHref={`/comments/article/${article.slug}`}
                voteScore={article.vote_score}
                myScore={article.my_score}
                contentType={ContentTypeEnum.ARTICLE}
                slug={article.slug}
            >
                {article.views > 0 && (
                    <StatItem className="pointer-events-none">
                        <Eye />
                        {article.views}
                    </StatItem>
                )}
            </VoteCommentsFooter>
        </article>
    );
};

export default ArticleItem;
