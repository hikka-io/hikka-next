'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FC } from 'react';
import MdiDotsHorizontal from '~icons/mdi/dots-horizontal';

import H5 from '@/components/typography/h5';
import P from '@/components/typography/p';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import useArticle from '@/services/hooks/articles/use-article';

interface Props {}

const ArticleAuthor: FC<Props> = () => {
    const params = useParams();

    const { data: article } = useArticle({
        slug: String(params.slug),
    });

    return (
        <div className="flex items-center justify-between gap-2 p-4">
            <div className="flex items-center gap-3">
                <Link href={`/u/${article?.author.username}`}>
                    <Avatar className="size-12 rounded-md">
                        <AvatarFallback className="rounded-md">
                            {article?.author.username[0]}
                        </AvatarFallback>
                        <AvatarImage src={article?.author.avatar} />
                    </Avatar>
                </Link>
                <div className="flex flex-col gap-1">
                    <Link href={`/u/${article?.author.username}`}>
                        <H5>{article?.author.username}</H5>
                    </Link>
                    <P className="text-xs text-muted-foreground">2 дні тому</P>
                </div>
            </div>
            <div className="flex gap-2">
                <Button size="md" variant="outline">
                    Відстежується
                </Button>
                <Button size="icon-md" variant="outline">
                    <MdiDotsHorizontal className="size-4" />
                </Button>
            </div>
        </div>
    );
};

export default ArticleAuthor;
