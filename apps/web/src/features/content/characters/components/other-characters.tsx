import type { FC } from 'react';

import type { MainContentTypeEnum } from '@hikka/api';

import CharacterCard from '@/components/content-card/character-card';
import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import Stack from '@/components/ui/stack';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

import { contentCharactersOptions } from '../../queries';

type Props = {
    extended?: boolean;
    content_type: MainContentTypeEnum;
};

const OtherCharacters: FC<Props> = ({ extended, content_type }) => {
    const params = useParams();
    const { list } = useInfiniteList(
        contentCharactersOptions(content_type, String(params.slug)),
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
                className="grid-min-6 grid-cols-3 sm:grid-cols-4"
                extended={extended}
                imagePreset="card"
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
