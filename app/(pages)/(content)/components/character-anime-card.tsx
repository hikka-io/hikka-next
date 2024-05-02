import * as React from 'react';
import { FC } from 'react';

import EntryCard, {
    Props as EntryCardProps,
} from '@/components/entry-card/entry-card';

interface Props extends EntryCardProps {
    character: API.Character;
    anime: API.Anime | API.AnimeInfo;
}

const CharacterAnimeCard: FC<Props> = ({ character, anime, ...props }) => {
    return (
        <EntryCard
            key={character.slug + anime.slug}
            href={`/characters/${character.slug}`}
            poster={character.image}
            title={character.name_ua || character.name_en || character.name_ja}
            slug={character.slug}
            withContextMenu
            content_type="character"
            disableChildrenLink
            description={anime.title}
            {...props}
        >
            <div className="absolute bottom-0 left-0 z-0 h-16 w-full bg-gradient-to-t from-black to-transparent" />
            <div className="absolute bottom-2 right-2 z-[1] flex h-auto w-16 rounded-lg border border-secondary/60 shadow-lg transition-all hover:w-28">
                <EntryCard
                    href={`/anime/${anime.slug}`}
                    poster={anime.poster}
                />
            </div>
        </EntryCard>
    );
};

export default CharacterAnimeCard;
