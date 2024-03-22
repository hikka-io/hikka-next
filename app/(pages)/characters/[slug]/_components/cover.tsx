'use client';

import { useParams } from 'next/navigation';

import FavoriteButton from '@/components/favorite-button';
import EntryCard from '@/components/entry-card/entry-card';
import useCharacterInfo from '@/services/hooks/characters/useCharacterInfo';

const Component = () => {
    const params = useParams();

    const { data: character } = useCharacterInfo({ slug: String(params.slug) });

    if (!character) {
        return null;
    }

    return (
        <div className="flex items-center px-16 md:px-48 lg:px-0">
            <EntryCard poster={character.image}>
                <FavoriteButton
                    slug={character.slug}
                    content_type="character"
                />
                <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-black to-transparent" />
            </EntryCard>
        </div>
    );
};

export default Component;
