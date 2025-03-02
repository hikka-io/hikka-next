'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import useNovelCharacters from '@/services/hooks/novel/use-novel-characters';

import CharacterCard from '../../../../components/character-card';

interface Props {
    extended?: boolean;
}

const MainCharacters: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list } = useNovelCharacters({ slug: String(params.slug) });

    if (!list || list.length === 0) {
        return null;
    }

    const main = list.filter((ch) => ch.main);

    return (
        <Block>
            <Header href={!extended ? params.slug + '/characters' : undefined}>
                <HeaderContainer>
                    <HeaderTitle>Головні Персонажі</HeaderTitle>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
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
