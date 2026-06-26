import type { FC } from 'react';

import {
    type AnimeResponseWithWatch,
    ContentTypeEnum,
    type PersonResponse,
} from '@hikka/api';
import { useTitle } from '@/utils/title/use-title';

import CardOverlay from './card-overlay';
import ContentCard, { type ContentCardProps } from './content-card';

type Props = ContentCardProps & {
    person: PersonResponse;
    anime: AnimeResponseWithWatch;
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
