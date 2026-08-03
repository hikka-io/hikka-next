import type { FC } from 'react';

import {
    type AnimeResponseWithWatch,
    type CharacterResponse,
    ContentTypeEnum,
} from '@hikka/api';

import { useTitle } from '@/features/auth/hooks/use-title';

import CardOverlay from './card-overlay';
import EntityCard, { type EntityCardProps } from './entity-card';

type Props = Omit<EntityCardProps, 'entity'> & {
    character: CharacterResponse;
    anime: AnimeResponseWithWatch;
};

const CharacterAnimeCard: FC<Props> = ({ character, anime, ...props }) => {
    const animeTitle = useTitle(anime);

    return (
        <EntityCard
            entity={{ type: ContentTypeEnum.CHARACTER, data: character }}
            withContextMenu
            description={animeTitle}
            overlay={
                <CardOverlay
                    href={`/anime/${anime.slug}`}
                    image={anime.image}
                />
            }
            {...props}
        />
    );
};

export default CharacterAnimeCard;
