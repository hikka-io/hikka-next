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

    if (!article?.cover) {
        return null;
    }

    return (
        <Image
            src="https://i.pinimg.com/originals/8a/1c/20/8a1c20db423f85de20c1269b348713b3.jpg"
            alt={'article cover'}
            width={1260}
            height={283}
            className="h-52 w-full object-cover"
        />
    );
};

export default ArticleCover;
