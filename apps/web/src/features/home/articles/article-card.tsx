import { ArticleResponse, ContentTypeEnum } from '@hikka/client';
import Link from 'next/link';
import { FC } from 'react';

import Author from '@/components/article-item/article-author';
import BxBxsUpvote from '@/components/icons/bx/BxBxsUpvote';
import IconamoonCommentFill from '@/components/icons/iconamoon/IconamoonCommentFill';
import MaterialSymbolsVisibilityOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsVisibilityOutlineRounded';
import ArticleViewer from '@/components/markdown/editor/article-viewer';
import TextExpand from '@/components/text-expand';
import Muted from '@/components/typography/muted';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

interface Props {
    article: ArticleResponse;
}

const ArticleCard: FC<Props> = ({ article }) => {
    const document =
        article.document[0].type === 'preview'
            ? article.document[0].children
            : article.document;

    const contentElement = (
        <div className="relative flex flex-1 flex-col gap-4 p-4 py-0">
            <Link
                href={`${CONTENT_TYPE_LINKS.article}/${article.slug}`}
                className="absolute left-0 top-0 z-10 size-full"
            />
            <div className="flex flex-col gap-1">
                {article.content && (
                    <Muted>
                        {article.content.title_ua ||
                            article.content.title_en ||
                            (article.content.data_type ===
                                ContentTypeEnum.ANIME &&
                                article.content.title_ja)}
                    </Muted>
                )}
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">{article.title}</HeaderTitle>
                    </HeaderContainer>
                </Header>
            </div>
            <ArticleViewer initialValue={document} />
        </div>
    );

    return (
        <Card className="isolate gap-0 overflow-hidden p-0">
            <Author article={article} preview />
            <TextExpand alwaysCollapsed>{contentElement}</TextExpand>
            <div className="flex items-center justify-between p-4">
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
                <div className="flex gap-1">
                    {article.views > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="pointer-events-none gap-1 text-muted-foreground"
                        >
                            <MaterialSymbolsVisibilityOutlineRounded className="size-3" />
                            {article.views}
                        </Button>
                    )}
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-muted-foreground"
                    >
                        <Link href={`/comments/article/${article.slug}`}>
                            <IconamoonCommentFill className="size-3" />
                            {article.comments_count}
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="pointer-events-none gap-1 text-muted-foreground"
                    >
                        <BxBxsUpvote className="size-3" />
                        {article.vote_score}
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default ArticleCard;
