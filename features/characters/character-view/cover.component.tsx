'use client';

import { useParams } from 'next/navigation';

import ContentCard from '@/components/content-card/content-card';
import FavoriteButton from '@/components/favorite-button';

import useCharacterInfo from '@/services/hooks/characters/use-character-info';

const Cover = () => {
    const params = useParams();

    const { data: character } = useCharacterInfo({ slug: String(params.slug) });

    if (!character) {
        return null;
    }

    return (
        <div className="flex items-center px-16 md:px-48 lg:px-0">
            <ContentCard image={character.image}>
                <div className="absolute bottom-2 right-2 z-[1]">
                    <FavoriteButton
                        slug={character.slug}
                        content_type="character"
                    />
                </div>
                <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-black to-transparent" />
            </ContentCard>
        </div>
    );
};

export default Cover;
