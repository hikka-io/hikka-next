'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import CharacterCard from '@/components/character-card';
import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import useNovelCharacters from '@/services/hooks/novel/use-novel-characters';

interface Props {
    extended?: boolean;
}

const OtherCharacters: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list } = useNovelCharacters({ slug: String(params.slug) });

    if (!list || list.length === 0) {
        return null;
    }

    const other = list.filter((ch) => !ch.main);

    if (other.length === 0) {
        return null;
    }

    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle>Другорядні Персонажі</HeaderTitle>
                </HeaderContainer>
            </Header>
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
