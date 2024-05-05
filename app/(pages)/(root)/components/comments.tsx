'use client';

import * as React from 'react';
import { FC } from 'react';

import ContentCard from '@/components/content-card/content-card';
import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import HorizontalCard from '@/components/ui/horizontal-card';
import useLatestComments from '@/services/hooks/comments/useLatestComments';
import { CONTENT_TYPE_LINKS } from '@/utils/constants';
import { cn } from '@/utils/utils';

interface Props {
    className?: string;
}

const Comments: FC<Props> = ({ className }) => {
    const { data: comments } = useLatestComments();

    return (
        <Block className={cn(className)}>
            <Header title="Коментарі" />
            <div className="flex flex-col gap-6">
                {comments?.map((item) => (
                    <HorizontalCard
                        image={item.author.avatar}
                        imageRatio={1}
                        description={item.text}
                        key={item.created}
                        title={item.author.username}
                        href={`/u/${item.author.username}`}
                        createdAt={item.created}
                    >
                        <ContentCard
                            className="w-10"
                            poster={item.image}
                            href={`${CONTENT_TYPE_LINKS[item.content_type]}/${item.slug}`}
                        />
                    </HorizontalCard>
                ))}
            </div>
        </Block>
    );
};

export default Comments;
