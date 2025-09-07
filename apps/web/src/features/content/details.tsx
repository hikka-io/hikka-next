'use client';

import {
    AnimeInfoResponse,
    CharacterResponse,
    ContentTypeEnum,
    MangaInfoResponse,
    NovelInfoResponse,
    PersonResponse,
} from '@hikka/client';
import { useParams } from 'next/navigation';

import { CONTENT_CONFIG } from '@/utils/constants/common';

import CharacterDetails from './components/details/character-details';
import PersonDetails from './components/details/person-details';
import ReadDetails from './components/details/read-details';
import WatchDetails from './components/details/watch-details';

interface Props {
    className?: string;
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL
        | ContentTypeEnum.CHARACTER
        | ContentTypeEnum.PERSON;
}

const Details = ({ className, content_type }: Props) => {
    const params = useParams();

    const { data } = CONTENT_CONFIG[content_type].useInfo(String(params.slug));

    if (!data) {
        return null;
    }

    switch (content_type) {
        case ContentTypeEnum.ANIME:
            return (
                <WatchDetails
                    className={className}
                    data={data as AnimeInfoResponse}
                />
            );
        case ContentTypeEnum.MANGA:
            return (
                <ReadDetails
                    className={className}
                    data={data as MangaInfoResponse | NovelInfoResponse}
                />
            );
        case ContentTypeEnum.NOVEL:
            return (
                <ReadDetails
                    className={className}
                    data={data as NovelInfoResponse}
                />
            );
        case ContentTypeEnum.CHARACTER:
            return (
                <CharacterDetails
                    className={className}
                    data={data as CharacterResponse}
                />
            );
        case ContentTypeEnum.PERSON:
            return (
                <PersonDetails
                    className={className}
                    data={data as PersonResponse}
                />
            );
    }
};

export default Details;
