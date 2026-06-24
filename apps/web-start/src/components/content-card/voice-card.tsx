import type { FC } from 'react';

import {
    type AnimeInfoResponse,
    type AnimeResponse,
    ContentTypeEnum,
    type PersonResponse,
} from '@hikka/client';
import { useTitle } from '@hikka/react';

import CardOverlay from './card-overlay';
import ContentCard, { type ContentCardProps } from './content-card';

type Props = ContentCardProps & {
    person: PersonResponse;
    anime: AnimeInfoResponse | AnimeResponse;
    language: string;
};

const VoiceCard: FC<Props> = ({ person, anime, language, ...props }) => {
    const personTitle = useTitle(person);
    const animeTitle = useTitle(anime);

    return (
        <ContentCard
            key={person.slug + anime.slug}
            href={`/people/${person.slug}`}
            image={person.image}
            title={personTitle}
            description={animeTitle}
            disableChildrenLink
            withContextMenu
            content_type={ContentTypeEnum.PERSON}
            slug={person.slug}
            leftSubtitle={language.toUpperCase()}
            {...props}
        >
            <CardOverlay href={`/anime/${anime.slug}`} image={anime.image} />
        </ContentCard>
    );
};

export default VoiceCard;
