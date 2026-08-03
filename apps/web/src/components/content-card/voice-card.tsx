import type { FC } from 'react';

import {
    type AnimeResponseWithWatch,
    ContentTypeEnum,
    type PersonResponse,
} from '@hikka/api';

import { useTitle } from '@/features/auth/hooks/use-title';

import CardOverlay from './card-overlay';
import EntityCard, { type EntityCardProps } from './entity-card';

type Props = Omit<EntityCardProps, 'entity'> & {
    person: PersonResponse;
    anime: AnimeResponseWithWatch;
    language: string;
};

const VoiceCard: FC<Props> = ({ person, anime, language, ...props }) => {
    const animeTitle = useTitle(anime);

    return (
        <EntityCard
            entity={{ type: ContentTypeEnum.PERSON, data: person }}
            withContextMenu
            description={animeTitle}
            leftSubtitle={language.toUpperCase()}
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

export default VoiceCard;
