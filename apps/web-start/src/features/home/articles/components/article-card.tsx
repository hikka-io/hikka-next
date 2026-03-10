import { ArticlePreviewResponse, ContentTypeEnum } from '@hikka/client';
import { ArrowBigUp, Eye, MessageCircle } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { FC } from 'react';

import Author from '@/features/articles/article-item/article-author';
import { StaticViewer } from '@/components/plate/editor/static-viewer';
import TextExpand from '@/components/text-expand';
import { Badge } from '@/components/ui/badge';
import Card from '@/components/ui/card';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { StatItem, StatItemGroup } from '@/components/ui/stat-item';

import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

interface Props {
    article: ArticlePreviewResponse;
}

const ArticleCard: FC<Props> = ({ article }) => {
    const document = article.preview;

    const contentElement = (
        <div className="relative flex flex-1 flex-col gap-4 p-4 py-0">
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
                        <HeaderTitle variant="h4">{article.title}</HeaderTitle>
                    </HeaderContainer>
                </Header>
            </div>
            {article.tags.length > 0 && (
                <div className="flex gap-2">
                    {article.tags.length > 0 && (
                        <Badge variant="secondary">
                            {article.tags[0].name}
                        </Badge>
                    )}

                    {article.tags.length > 1 && (
                        <Badge variant="outline">
                            +{article.tags.length - 1}
                        </Badge>
                    )}
                </div>
            )}
            <StaticViewer value={document} />
        </div>
    );

    return (
        <Card className="isolate flex flex-col gap-0 overflow-hidden p-0">
            <Author article={article} preview />
            <div className="flex-1 overflow-hidden">
                <TextExpand alwaysCollapsed className="h-full">
                    {contentElement}
                </TextExpand>
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

export default ArticleCard;
