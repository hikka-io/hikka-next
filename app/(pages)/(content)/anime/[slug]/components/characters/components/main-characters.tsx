'use client';

import { useParams } from 'next/navigation';

import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import Stack from '@/components/ui/stack';
import useCharacters from '@/services/hooks/anime/useCharacters';

import CharacterCard from '../../../../../components/character-card';

interface Props {
    extended?: boolean;
}

const MainCharacters = ({ extended }: Props) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useCharacters({ slug: String(params.slug) });

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
