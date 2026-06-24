'use client';

import type { FC } from 'react';

import { useCharacterVoices } from '@hikka/react';

import VoiceCard from '@/components/content-card/voice-card';
import AppearanceGrid from '@/features/common/appearance-grid';
import { useParams } from '@/utils/navigation';

type Props = {
    extended?: boolean;
};

const Voices: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useCharacterVoices({ slug: String(params.slug) });

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

export default Voices;
