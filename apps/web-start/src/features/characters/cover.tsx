'use client';

import { useCharacterBySlug } from '@hikka/react';
import { useParams } from 'next/navigation';

import ContentCard from '@/components/content-card/content-card';

const Cover = () => {
    const params = useParams();

    const { data: character } = useCharacterBySlug({
        slug: String(params.slug),
    });

    if (!character) {
        return null;
    }

    return (
        <div className="flex items-center px-16 md:px-48 lg:px-0">
            <ContentCard image={character.image} />
        </div>
    );
};

export default Cover;
