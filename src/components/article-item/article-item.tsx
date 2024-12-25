import Link from 'next/link';
import { FC } from 'react';

import BxBxsUpvote from '@/components/icons/bx/BxBxsUpvote';
import IconamoonCommentFill from '@/components/icons/iconamoon/IconamoonCommentFill';
import MDViewer from '@/components/markdown/viewer/MD-viewer';
import Muted from '@/components/typography/muted';
import { Badge } from '@/components/ui/badge';
import Card from '@/components/ui/card';
import Image from '@/components/ui/image';
import { Label } from '@/components/ui/label';

import { Header, HeaderContainer, HeaderTitle } from '../ui/header';
import Author from './article-author';

interface Props {
    article: API.Article;
}

const ArticleItem: FC<Props> = ({ article }) => {
    return (
        <Card className="gap-0 overflow-hidden p-0">
            <Author article={article} />
            <Link
                className="flex cursor-pointer flex-col gap-4"
                href={`/${article.category}/${article.slug}`}
            >
                {article.cover && (
                    <Image
                        src={article.cover}
                        alt="cover"
                        height={283}
                        width={584}
                        className="h-52 w-full object-cover"
                    />
                )}
                <div className="flex flex-col gap-4 p-4">
                    <div className="flex flex-col gap-1">
                        {article.content && (
                            <Muted>
                                {article.content.title_ua ||
                                    article.content.title_en ||
                                    article.content.title_ja}
                            </Muted>
                        )}
                        <Header>
                            <HeaderContainer>
                                <HeaderTitle variant="h4">
                                    {article.title}
                                </HeaderTitle>
                            </HeaderContainer>
                        </Header>
                    </div>
                    <MDViewer
                        preview
                        className="line-clamp-3 text-sm text-muted-foreground"
                    >
                        {article.text.substring(0, 500)}
                    </MDViewer>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            {article.tags.map((tag) => (
                                <Badge key={tag.name} variant="secondary">
                                    {tag.name}
                                </Badge>
                            ))}
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1">
                                <IconamoonCommentFill className="size-3 text-muted-foreground" />
                                <Label className="leading-none text-muted-foreground">
                                    {article.comments_count}
                                </Label>
                            </div>
                            <div className="flex items-center gap-1">
                                <BxBxsUpvote className="size-3 text-muted-foreground" />
                                <Label className="leading-none text-muted-foreground">
                                    {article.vote_score}
                                </Label>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </Card>
    );
};

export default ArticleItem;
