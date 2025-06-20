import { ArticleResponse, ContentTypeEnum } from '@hikka/client';
import Link from 'next/link';
import { FC } from 'react';

import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

import BxBxsUpvote from '../icons/bx/BxBxsUpvote';
import IconamoonCommentFill from '../icons/iconamoon/IconamoonCommentFill';
import MaterialSymbolsVisibilityOutlineRounded from '../icons/material-symbols/MaterialSymbolsVisibilityOutlineRounded';
import ArticleViewer from '../markdown/editor/article-viewer';
import Muted from '../typography/muted';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import Card from '../ui/card';
import { Header, HeaderContainer, HeaderTitle } from '../ui/header';
import Author from './article-author';

interface Props {
    article: ArticleResponse;
}

const ArticleItem: FC<Props> = ({ article }) => {
    const document =
        article.document[0].type === 'preview'
            ? article.document[0].children
            : article.document;

    return (
        <Card className="isolate gap-0 overflow-hidden rounded-none p-0 md:rounded-lg">
            <Author article={article} />
            <div className="relative flex flex-col gap-4 p-4 py-0">
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
                            <HeaderTitle variant="h3">
                                {article.title}
                            </HeaderTitle>
                        </HeaderContainer>
                    </Header>
                </div>
                <ArticleViewer initialValue={document} />
            </div>
            <div className="flex items-center justify-between p-4">
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

export default ArticleItem;
