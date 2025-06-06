'use client';

import { ContentTypeEnum, FavouriteContentType } from '@hikka/client';
import { useParams } from 'next/navigation';
import { FC, useState } from 'react';

import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import Anime from './anime';
import Character from './characters';
import Collections from './collections';
import Manga from './manga';
import Novel from './novel';

interface Props {
    extended?: boolean;
}

const Favorites: FC<Props> = ({ extended }) => {
    const [content, setContent] = useState<FavouriteContentType>(
        ContentTypeEnum.ANIME,
    );
    const params = useParams();

    const getComponent = () => {
        switch (content) {
            case ContentTypeEnum.ANIME:
                return <Anime extended={extended} />;
            case ContentTypeEnum.CHARACTER:
                return <Character extended={extended} />;
            case ContentTypeEnum.MANGA:
                return <Manga extended={extended} />;
            case ContentTypeEnum.NOVEL:
                return <Novel extended={extended} />;
            case ContentTypeEnum.COLLECTION:
                return <Collections extended={extended} />;
            default:
                return null;
        }
    };

    return (
        <Block>
            <Header
                href={
                    !extended
                        ? '/u/' + params.username + '/favorites'
                        : undefined
                }
            >
                <HeaderContainer>
                    <HeaderTitle>Улюблені</HeaderTitle>
                    <ToggleGroup
                        type="single"
                        value={content}
                        onValueChange={(value: FavouriteContentType) =>
                            value && setContent(value)
                        }
                        size="badge"
                    >
                        <ToggleGroupItem
                            value={ContentTypeEnum.ANIME}
                            aria-label="Улюблені аніме"
                        >
                            Аніме
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value={ContentTypeEnum.MANGA}
                            aria-label="Улюблена манґа"
                        >
                            Манґа
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value={ContentTypeEnum.NOVEL}
                            aria-label="Улюблене ранобе"
                        >
                            Ранобе
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value={ContentTypeEnum.CHARACTER}
                            aria-label="Улюблені персонажі"
                        >
                            Персонажі
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value={ContentTypeEnum.COLLECTION}
                            aria-label="Улюблені колекції"
                        >
                            Колекції
                        </ToggleGroupItem>
                    </ToggleGroup>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            {getComponent()}
        </Block>
    );
};

export default Favorites;
