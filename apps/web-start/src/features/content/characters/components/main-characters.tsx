'use client';

import { ContentTypeEnum } from '@hikka/client';
import { FC } from 'react';

import CharacterCard from '@/components/content-card/character-card';
import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import { CONTENT_CONFIG } from '@/utils/constants/common';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { useParams } from '@/utils/navigation';

interface Props {
    extended?: boolean;
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
}

const MainCharacters: FC<Props> = ({ extended, content_type }) => {
    const params = useParams();
    const { list } = CONTENT_CONFIG[content_type].useCharacters(
        String(params.slug),
    );

    if (!list || list.length === 0) {
        return null;
    }

    const main = list.filter((ch) => ch.main);

    return (
        <Block>
            <Header
                href={
                    !extended
                        ? `${CONTENT_TYPE_LINKS[content_type]}/${params.slug}/characters`
                        : undefined
                }
            >
                <HeaderContainer>
                    <HeaderTitle>Головні Персонажі</HeaderTitle>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <Stack
                size={5}
                extendedSize={5}
                className="grid-min-6"
                extended={extended}
                imagePreset="card"
            >
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
