'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import CharacterCard from '@/components/character-card';
import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import { CONTENT_CONFIG } from '@/utils/constants/common';

interface Props {
    extended?: boolean;
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
}

const OtherCharacters: FC<Props> = ({ extended, content_type }) => {
    const params = useParams();
    const { list } = CONTENT_CONFIG[content_type].useCharacters(
        String(params.slug),
    );

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
            <Stack
                size={5}
                extendedSize={5}
                className="grid-min-6"
                extended={extended}
            >
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
