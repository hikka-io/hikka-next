'use client';

import { useCharacterVoices } from '@hikka/react';
import { FC } from 'react';

import VoiceCard from '@/components/content-card/voice-card';
import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import { useParams } from '@/utils/navigation';

interface Props {
    extended?: boolean;
}

const Voices: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useCharacterVoices({ slug: String(params.slug) });

    if (!list || list.length === 0) {
        return null;
    }

    return (
        <Block>
            <Header
                href={
                    !extended ? `/characters/${params.slug}/voices` : undefined
                }
            >
                <HeaderContainer>
                    <HeaderTitle>Сейю</HeaderTitle>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <Stack size={4} extendedSize={5} extended={extended}>
                {(extended ? list : list.slice(0, 4)).map((ch) => (
                    <VoiceCard
                        key={ch.person.slug + ch.anime.slug}
                        anime={ch.anime}
                        person={ch.person}
                        language={ch.language}
                    />
                ))}
            </Stack>
            {extended && hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    ref={ref}
                />
            )}
        </Block>
    );
};

export default Voices;
