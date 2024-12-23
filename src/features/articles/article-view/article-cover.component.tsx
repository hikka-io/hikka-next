'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import Image from '@/components/ui/image';

import useArticle from '@/services/hooks/articles/use-article';
import { CONTENT_TYPES } from '@/utils/constants/common';

interface Props {}

const ArticleCover: FC<Props> = () => {
    const params = useParams();

    const { data: article } = useArticle({
        slug: String(params.slug),
    });

    if (article?.category === 'system') {
        return null;
    }

    if (!article?.cover) {
        return null;
    }

    return (
        <div className="relative">
            {article.content && (
                <div className="absolute bottom-0 left-0 w-full h-full p-4 z-0 flex items-end">
                    <HorizontalCard
                        className="z-[1]"
                        href={`/${article.content?.data_type}/${article.content?.slug}`}
                    >
                        <HorizontalCardImage image={article.content?.image} />
                        <HorizontalCardContainer>
                            <HorizontalCardTitle>
                                {article.content?.title_ua ||
                                    article.content?.title_en ||
                                    article.content?.title_ja}
                            </HorizontalCardTitle>
                            <HorizontalCardDescription>
                                {
                                    CONTENT_TYPES[article.content?.data_type]
                                        .title_ua
                                }
                            </HorizontalCardDescription>
                        </HorizontalCardContainer>
                    </HorizontalCard>
                    <div className="absolute left-0 bottom-0 -z-[1] h-full w-full bg-gradient-to-t from-black to-transparent" />
                </div>
            )}
            <Image
                src={article.cover}
                alt={'article cover'}
                width={768}
                height={208}
                className="h-52 w-full object-cover"
            />
        </div>
    );
};

export default ArticleCover;
