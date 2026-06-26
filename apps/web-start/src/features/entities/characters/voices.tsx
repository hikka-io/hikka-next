import type { ComponentProps, FC } from 'react';

import { characterVoicesInfiniteOptions } from '@hikka/api';

import VoiceCard from '@/components/content-card/voice-card';
import AppearanceGrid from '@/features/entities/appearance-grid';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

type Props = {
    extended?: boolean;
};

const Voices: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useInfiniteList(
            characterVoicesInfiniteOptions({
                path: { slug: String(params.slug) },
            }),
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
                    // TODO(phase2): drop cast
                    anime={
                        ch.anime as unknown as ComponentProps<
                            typeof VoiceCard
                        >['anime']
                    }
                    // TODO(phase2): drop cast
                    person={
                        ch.person as unknown as ComponentProps<
                            typeof VoiceCard
                        >['person']
                    }
                    language={ch.language}
                />
            )}
        />
    );
};

export default Voices;
