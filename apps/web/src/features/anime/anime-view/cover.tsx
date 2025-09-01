'use client';

import { useAnimeBySlug, useSession } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import ContentCard from '@/components/content-card/content-card';

const Cover: FC = () => {
    const { user: loggedUser } = useSession();
    const params = useParams();
    const { data: anime } = useAnimeBySlug({ slug: String(params.slug) });

    return (
        <div className="z-0 flex items-center px-16 md:px-48 lg:px-0">
            <ContentCard imageProps={{ priority: true }} image={anime?.image} />
        </div>
    );
};

export default Cover;
