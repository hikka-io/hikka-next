import { formatDistance } from 'date-fns';
import Link from 'next/link';
import { FC } from 'react';

import BxBxsUpvote from '@/components/icons/bx/BxBxsUpvote';
import IconamoonCommentFill from '@/components/icons/iconamoon/IconamoonCommentFill';
import { MaterialSymbolsMoreHoriz } from '@/components/icons/material-symbols/MaterialSymbolsMoreHoriz';
import MDViewer from '@/components/markdown/viewer/MD-viewer';
import Muted from '@/components/typography/muted';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import Header from '@/components/ui/header';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import Image from '@/components/ui/image';
import { Label } from '@/components/ui/label';

interface Props {
    article: API.Article;
}

const ArticleItem: FC<Props> = ({ article }) => {
    return (
        <Card className="p-0 gap-0 overflow-hidden">
            <div className="flex p-4 justify-between items-center">
                <HorizontalCard href={`/u/${article.author.username}`}>
                    <HorizontalCardImage
                        image={article.author.avatar}
                        imageRatio={1}
                    />
                    <HorizontalCardContainer className="gap-0">
                        <HorizontalCardTitle>
                            {article.author.username}
                        </HorizontalCardTitle>
                        <HorizontalCardDescription>
                            {formatDistance(
                                article.updated * 1000,
                                Date.now(),
                                { addSuffix: true },
                            )}
                        </HorizontalCardDescription>
                    </HorizontalCardContainer>
                </HorizontalCard>
                <Button size="icon-md" variant="outline">
                    <MaterialSymbolsMoreHoriz className="size-4" />
                </Button>
            </div>
            <Link
                className="flex flex-col gap-4 cursor-pointer"
                href={`/${article.category}/${article.slug}`}
            >
                {article.cover && (
                    <Image
                        src={article.cover}
                        alt="cover"
                        height={283}
                        width={584}
                        className="w-full h-52 object-cover"
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
                        <Header variant="h4" title={article.title} />
                    </div>
                    <MDViewer
                        preview
                        className="text-sm text-muted-foreground line-clamp-3"
                    >
                        {article.text.substring(0, 500)}
                    </MDViewer>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            {article.tags.map((tag) => (
                                <Badge key={tag} variant="secondary">
                                    {tag}
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
