import * as React from 'react';
import { FC } from 'react';

import EntryCard, {
    Props as EntryCardProps,
} from '@/components/entry-card/entry-card';

interface Props extends EntryCardProps {
    person: API.Person;
    anime: API.AnimeInfo | API.Anime;
    language: string;
}

const VoiceCard: FC<Props> = ({ person, anime, language, ...props }) => {
    return (
        <EntryCard
            key={person.slug + anime.slug}
            href={`/people/${person.slug}`}
            poster={person.image}
            title={person.name_ua || person.name_en || person.name_native}
            description={anime.title}
            disableChildrenLink
            leftSubtitle={language.toUpperCase()}
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

export default VoiceCard;
