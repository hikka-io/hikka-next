import {
    AnimeInfoResponse,
    AnimeResponse,
    ContentTypeEnum,
    PersonResponse,
} from '@hikka/client';
import { useTitle } from '@hikka/react';
import { FC } from 'react';

import CardOverlay from './card-overlay';
import ContentCard, { ContentCardProps } from './content-card';

interface Props extends ContentCardProps {
    person: PersonResponse;
    anime: AnimeInfoResponse | AnimeResponse;
    language: string;
}

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
