import type { FC } from 'react';

import { ContentTypeEnum } from '@hikka/api';

import VoiceCard from '@/components/content-card/voice-card';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

import AppearanceGrid from '../appearance-grid';
import { entityAppearanceOptions } from '../queries';

type Props = {
    extended?: boolean;
};

const CharacterVoices: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useInfiniteList(
            entityAppearanceOptions(
                ContentTypeEnum.CHARACTER,
                'voices',
                String(params.slug),
                { preview: !extended },
            ),
        );

    return (
        <AppearanceGrid
            title="Сейю"
            href={`/characters/${params.slug}/voices`}
            stackClassName="grid-cols-3 sm:grid-cols-4"
            extended={extended}
            list={list}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            ref={ref}
            renderItem={(ch) => (
                <VoiceCard
                    key={ch.person.slug + ch.anime.slug}
                    anime={ch.anime}
                    person={ch.person}
                    language={ch.language}
                />
            )}
        />
    );
};

export default CharacterVoices;
