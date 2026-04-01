'use client';

import { useCharacterBySlug } from '@hikka/react';

import ContentCard from '@/components/content-card/content-card';

import { useParams } from '@/utils/navigation';

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
            <ContentCard image={character.image} imagePreset="cardLg" />
        </div>
    );
};

export default Cover;
