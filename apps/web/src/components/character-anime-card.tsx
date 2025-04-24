import {
    AnimeInfoResponse,
    AnimeResponse,
    CharacterResponse,
    ContentTypeEnum,
} from '@hikka/client';
import { FC } from 'react';

import ContentCard, {
    Props as ContentCardProps,
} from './content-card/content-card';

interface Props extends ContentCardProps {
    character: CharacterResponse;
    anime: AnimeResponse | AnimeInfoResponse;
}

const CharacterAnimeCard: FC<Props> = ({ character, anime, ...props }) => {
    return (
        <ContentCard
            key={character.slug + anime.slug}
            href={`/characters/${character.slug}`}
            image={character.image}
            title={character.name_ua || character.name_en || character.name_ja}
            slug={character.slug}
            withContextMenu
            content_type={ContentTypeEnum.CHARACTER}
            disableChildrenLink
            description={anime.title}
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

export default CharacterAnimeCard;
