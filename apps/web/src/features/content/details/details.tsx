import { useQuery } from '@tanstack/react-query';

import {
    type AnimeInfoResponse,
    type CharacterResponse,
    ContentTypeEnum,
    type MainContentTypeEnum,
    type MangaInfoResponse,
    type NovelInfoResponse,
    type PersonResponse,
} from '@hikka/api';

import { contentInfoOptions } from '@/utils/api/content-queries';
import { useParams } from '@/utils/navigation';

import EntityDetails from './components/entity-details';
import ReadDetails from './components/read-details';
import WatchDetails from './components/watch-details';

type Props = {
    className?: string;
    content_type: MainContentTypeEnum | 'character' | 'person';
};

const ContentDetails = ({ className, content_type }: Props) => {
    const params = useParams();

    const { data } = useQuery(
        contentInfoOptions(content_type, String(params.slug)),
    );

    if (!data) {
        return null;
    }

    // `data` is the union of every content info type; the content_type
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
                <EntityDetails
                    className={className}
                    data={data as CharacterResponse}
                    entityType="character"
                />
            );
        case ContentTypeEnum.PERSON:
            return (
                <EntityDetails
                    className={className}
                    data={data as PersonResponse}
                    entityType="person"
                />
            );
    }
};

export default ContentDetails;
