import type { FC } from 'react';

import type { MainContentTypeEnum } from '@hikka/api';

import CharacterCard from '@/components/content-card/character-card';
import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import Stack from '@/components/ui/stack';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { CONTENT_TYPE_LINKS } from '@/utils/content-paths';
import { useParams } from '@/utils/navigation';

import { contentCharactersOptions } from '../../queries';

type Props = {
    extended?: boolean;
    content_type: MainContentTypeEnum;
};

const MainCharacters: FC<Props> = ({ extended, content_type }) => {
    const params = useParams();
    const { list } = useInfiniteList(
        contentCharactersOptions(content_type, String(params.slug)),
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
                className="grid-min-6 grid-cols-3 sm:grid-cols-4"
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
