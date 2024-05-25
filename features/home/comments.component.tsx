'use client';

import { FC } from 'react';

import ContentCard from '@/components/content-card/content-card';
import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import HorizontalCard from '@/components/ui/horizontal-card';

import useLatestComments from '@/services/hooks/comments/use-latest-comments';
import { cn } from '@/utils/utils';

interface Props {
    className?: string;
}

const Comments: FC<Props> = ({ className }) => {
    const { data: comments } = useLatestComments();

    return (
        <Block className={cn(className)}>
            <Header title="Коментарі" href="/comments/latest" />
            <div className="flex flex-col gap-6">
                {comments?.map((item) => (
                    <HorizontalCard
                        image={item.author.avatar}
                        imageRatio={1}
                        description={item.text}
                        descriptionHref={`/comments/${item.content_type}/${item.slug}`}
                        key={item.created}
                        title={item.author.username}
                        href={`/u/${item.author.username}`}
                        createdAt={item.created}
                    >
                        <ContentCard
                            className="w-10"
                            poster={item.image}
                            href={`/comments/${item.content_type}/${item.slug}`}
                        />
                    </HorizontalCard>
                ))}
            </div>
        </Block>
    );
};

export default Comments;
