import {
    type AnimeInfoResponse,
    type CharacterResponse,
    ContentTypeEnum,
    type MangaInfoResponse,
    type NovelInfoResponse,
    type PersonResponse,
} from '@hikka/api';

import { CONTENT_CONFIG } from '@/utils/constants/common';
import { useParams } from '@/utils/navigation';

import CharacterDetails from './components/character-details';
import PersonDetails from './components/person-details';
import ReadDetails from './components/read-details';
import WatchDetails from './components/watch-details';

type Props = {
    className?: string;
    content_type: 'anime' | 'manga' | 'novel' | 'character' | 'person';
};

const Details = ({ className, content_type }: Props) => {
    const params = useParams();

    const { data } = CONTENT_CONFIG[content_type].useInfo(String(params.slug));

    if (!data) {
        return null;
    }

    // TODO(phase2): drop casts — `data` comes from CONTENT_CONFIG (still
    // @hikka/client-typed); cast across to the @hikka/api component prop types.
    switch (content_type) {
        case ContentTypeEnum.ANIME:
            return (
                <WatchDetails
                    className={className}
                    data={data as unknown as AnimeInfoResponse}
                />
            );
        case ContentTypeEnum.MANGA:
            return (
                <ReadDetails
                    className={className}
                    data={
                        data as unknown as
                            | MangaInfoResponse
                            | NovelInfoResponse
                    }
                />
            );
        case ContentTypeEnum.NOVEL:
            return (
                <ReadDetails
                    className={className}
                    data={data as unknown as NovelInfoResponse}
                />
            );
        case ContentTypeEnum.CHARACTER:
            return (
                <CharacterDetails
                    className={className}
                    data={data as unknown as CharacterResponse}
                />
            );
        case ContentTypeEnum.PERSON:
            return (
                <PersonDetails
                    className={className}
                    data={data as unknown as PersonResponse}
                />
            );
    }
};

export default Details;
