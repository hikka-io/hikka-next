import type { FC } from 'react';

import { formatDistance } from 'date-fns';
import { uk } from 'date-fns/locale/uk';
import { ArrowBigUp, Eye, MessageCircle } from 'lucide-react';

import type { ArticleCategoryEnum, ArticlePreviewResponse } from '@hikka/api';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StatItem, StatItemGroup } from '@/components/ui/stat-item';
import { ARTICLE_CATEGORY_OPTIONS } from '@/utils/constants/common';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { Link } from '@/utils/navigation';

type Props = {
    article: ArticlePreviewResponse;
};

type SlateNode = {
    text?: string;
    children?: SlateNode[];
};

// The article `preview` is a slate value; pull the first non-empty block's
// plain text to show a one-line excerpt under the title.
const getFirstLine = (preview: ArticlePreviewResponse['preview']): string => {
    const read = (node: SlateNode): string =>
        typeof node.text === 'string'
            ? node.text
            : (node.children?.map(read).join('') ?? '');

    for (const node of preview) {
        const text = read(node as SlateNode).trim();
        if (text) return text;
    }

    return '';
};

const ArticlePreviewCard: FC<Props> = ({ article }) => {
    const href = `${CONTENT_TYPE_LINKS.article}/${article.slug}`;
    const excerpt = getFirstLine(article.preview);

    // Generated responses type `category` as a plain string; narrow it to the
    // enum that keys ARTICLE_CATEGORY_OPTIONS.
    const category = article.category as ArticleCategoryEnum;
    const categoryOption = ARTICLE_CATEGORY_OPTIONS[category];

    return (
        <div className="group relative flex flex-col gap-2 rounded-sm border-border/60 border-t px-2 py-2 transition-colors duration-100 first:border-t-0 hover:bg-secondary/60">
            <div className="flex items-center justify-between gap-2">
                <Link
                    to={`/u/${article.author.username}`}
                    className="relative z-10 flex min-w-0 items-center gap-2 text-muted-foreground text-xs transition-colors duration-100 hover:text-foreground"
                >
                    <Avatar className="size-5 shrink-0 rounded-sm">
                        <AvatarImage
                            className="size-5 rounded-sm"
                            src={article.author.avatar}
                        />
                        <AvatarFallback
                            className="size-5 rounded-sm text-[10px]"
                            title={article.author.username?.[0]}
                        />
                    </Avatar>
                    <span className="truncate">{article.author.username}</span>
                </Link>
                <div className="flex shrink-0 items-center gap-2">
                    <Badge variant="outline" className="shrink-0">
                        {categoryOption?.title_ua ?? category}
                    </Badge>
                    {article.draft && <Badge variant="warning">Чернетка</Badge>}
                </div>
            </div>

            <div className="flex flex-col gap-2 py-1">
                <Link
                    to={href}
                    title={article.title}
                    className="line-clamp-2 font-semibold text-sm leading-snug transition-colors duration-100 group-hover:text-foreground"
                >
                    {article.title}
                    <span className="absolute inset-0" />
                </Link>

                {excerpt && (
                    <p className="line-clamp-1 text-muted-foreground text-xs">
                        {excerpt}
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between gap-2">
                <span className="shrink-0 text-muted-foreground text-xs">
                    {formatDistance(article.created * 1000, Date.now(), {
                        addSuffix: true,
                        locale: uk,
                    })}
                </span>

                <StatItemGroup size="sm" className="shrink-0">
                    <StatItem size="sm">
                        <Eye />
                        <small>{article.views}</small>
                    </StatItem>
                    <StatItem size="sm">
                        <MessageCircle />
                        <small>{article.comments_count}</small>
                    </StatItem>
                    <StatItem size="sm">
                        <ArrowBigUp className="size-4!" />
                        <small>{article.vote_score}</small>
                    </StatItem>
                </StatItemGroup>
            </div>
        </div>
    );
};

export default ArticlePreviewCard;
