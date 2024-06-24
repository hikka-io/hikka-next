'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import useMangaCharacters from '@/services/hooks/manga/use-manga-characters';

import CharacterCard from '../../../../components/character-card';

interface Props {
    extended?: boolean;
}

const MainCharacters: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list } = useMangaCharacters({ slug: String(params.slug) });

    if (!list || list.length === 0) {
        return null;
    }

    const main = list.filter((ch) => ch.main);

    return (
        <Block>
            <Header
                title={'Головні Персонажі'}
                href={!extended ? params.slug + '/characters' : undefined}
            />
            <Stack size={5} className="grid-min-6" extended={extended}>
                {(extended ? main : main.slice(0, 5)).map((ch) => (
                    <CharacterCard
                        key={ch.character.slug}
                        character={ch.character}
                    />
                ))}
            </Stack>
        </Block>
    );
};

export default MainCharacters;
