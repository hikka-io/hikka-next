import {
    AnimeInfoResponse,
    AnimeResponse,
    ContentTypeEnum,
    PersonResponse,
} from '@hikka/client';
import { FC } from 'react';

import CardOverlay from './card-overlay';
import ContentCard, { ContentCardProps } from './content-card';

interface Props extends ContentCardProps {
    person: PersonResponse;
    anime: AnimeInfoResponse | AnimeResponse;
    language: string;
}

const VoiceCard: FC<Props> = ({ person, anime, language, ...props }) => {
    return (
        <ContentCard
            key={person.slug + anime.slug}
            href={`/people/${person.slug}`}
            image={person.image}
            title={person.name_ua || person.name_en || person.name_native}
            description={anime.title}
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
