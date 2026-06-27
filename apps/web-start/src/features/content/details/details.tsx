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

    // `data` is the union of every CONTENT_CONFIG info type; the content_type
    // switch can't narrow it (the lookup key is generic), so each branch
    // asserts the matching response type.
    switch (content_type) {
        case ContentTypeEnum.ANIME:
            return (
                <WatchDetails
                    className={className}
                    data={data as AnimeInfoResponse}
                />
            );
        case ContentTypeEnum.MANGA:
        case ContentTypeEnum.NOVEL:
            return (
                <ReadDetails
                    className={className}
                    data={data as MangaInfoResponse | NovelInfoResponse}
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
