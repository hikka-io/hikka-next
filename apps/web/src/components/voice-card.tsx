import {
    AnimeInfoResponse,
    AnimeResponse,
    ContentTypeEnum,
    PersonResponse,
} from '@hikka/client';
import { FC } from 'react';

import ContentCard, { ContentCardProps } from './content-card/content-card';

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
            <div className="from-background absolute bottom-0 left-0 z-0 h-16 w-full bg-gradient-to-t to-transparent" />
            <div className="border-border absolute bottom-2 right-2 z-[1] flex h-auto w-16 rounded-lg border shadow-lg transition-all hover:w-28">
                <ContentCard
                    href={`/anime/${anime.slug}`}
                    image={anime.image}
                />
            </div>
        </ContentCard>
    );
};

export default VoiceCard;
