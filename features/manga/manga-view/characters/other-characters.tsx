'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import CharacterCard from '@/components/character-card';
import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import useMangaCharacters from '@/services/hooks/manga/use-manga-characters';

interface Props {
    extended?: boolean;
}

const OtherCharacters: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list } = useMangaCharacters({ slug: String(params.slug) });

    if (!list || list.length === 0) {
        return null;
    }

    const other = list.filter((ch) => !ch.main);

    if (other.length === 0) {
        return null;
    }

    return (
        <Block>
            <Header title={'Другорядні Персонажі'} />
            <Stack size={5} className="grid-min-6" extended={extended}>
                {other.map((ch) => (
                    <CharacterCard
                        key={ch.character.slug}
                        character={ch.character}
                    />
                ))}
            </Stack>
        </Block>
    );
};

export default OtherCharacters;
