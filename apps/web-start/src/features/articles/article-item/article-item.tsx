import { ArticlePreviewResponse, ContentTypeEnum } from '@hikka/client';
import { ArrowBigUp, Eye, MessageCircle } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { FC } from 'react';

import { Badge } from '@/components/ui/badge';
import Card from '@/components/ui/card';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { StatItem, StatItemGroup } from '@/components/ui/stat-item';

import { cn } from '@/utils/cn';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

import { StaticViewer } from '@/components/plate/editor/static-viewer';
import Author from './article-author';

interface Props {
    article: ArticlePreviewResponse;
    className?: string;
}

const ArticleItem: FC<Props> = ({ article, className }) => {
    const document = article.preview;

    return (
        <Card
            className={cn(
                'isolate gap-0 overflow-hidden rounded-none border-x-0 p-0 md:rounded-lg md:border-x',
                className,
            )}
        >
            <Author article={article} />
            <div className="relative flex flex-col gap-4 p-4 py-0">
                <Link
                    to={`${CONTENT_TYPE_LINKS.article}/${article.slug}`}
                    className="absolute left-0 top-0 z-10 size-full"
                />
                <div className="flex flex-col gap-1">
                    {article.content && (
                        <p className="text-sm text-muted-foreground">
                            {article.content.title_ua ||
                                article.content.title_en ||
                                (article.content.data_type ===
                                    ContentTypeEnum.ANIME &&
                                    article.content.title_ja)}
                        </p>
                    )}
                    <Header>
                        <HeaderContainer>
                            <HeaderTitle variant="h3">
                                {article.title}
                            </HeaderTitle>
                        </HeaderContainer>
                    </Header>
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
            <div className="flex items-center justify-between p-4">
                <StatItemGroup>
                    {article.views > 0 && (
                        <StatItem className="pointer-events-none">
                            <Eye />
                            {article.views}
                        </StatItem>
                    )}
                    <StatItem asChild>
                        <Link to={`/comments/article/${article.slug}`}>
                            <MessageCircle />
                            {article.comments_count}
                        </Link>
                    </StatItem>
                    <StatItem className="pointer-events-none">
                        <ArrowBigUp className="size-5!" />
                        {article.vote_score}
                    </StatItem>
                </StatItemGroup>
            </div>
        </Card>
    );
};

export default ArticleItem;
