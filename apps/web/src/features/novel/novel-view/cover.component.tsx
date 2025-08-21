'use client';

import { useNovelBySlug } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import ContentCard from '@/components/content-card/content-card';

const Cover: FC = () => {
    const params = useParams();
    const { data: novel } = useNovelBySlug({ slug: String(params.slug) });

    return (
        <div className="flex items-center px-16 md:px-48 lg:px-0">
            <ContentCard imageProps={{ priority: true }} image={novel?.image} />
        </div>
    );
};

export default Cover;
