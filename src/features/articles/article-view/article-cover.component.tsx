'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import Image from '@/components/ui/image';

import useArticle from '@/services/hooks/articles/use-article';

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
        <Image
            src={article.cover}
            alt={'article cover'}
            width={1260}
            height={283}
            className="h-52 w-full object-cover"
        />
    );
};

export default ArticleCover;
