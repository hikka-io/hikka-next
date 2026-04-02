'use client';

import { ContentTypeEnum, FavouriteContentType } from '@hikka/client';
import { FC, useState } from 'react';

import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { useParams } from '@/utils/navigation';
import { DEFAULT_USER_UI } from '@/utils/ui';
import { mergeUserUI } from '@/utils/ui/merge';

import Anime from './components/favorite-anime';
import Character from './components/favorite-characters';
import Collections from './components/favorite-collections';
import Manga from './components/favorite-manga';
import Novel from './components/favorite-novel';

interface Props {
    extended?: boolean;
}

const Favorites: FC<Props> = ({ extended }) => {
    const [content, setContent] = useState<FavouriteContentType>(
        ContentTypeEnum.ANIME,
    );
    const params = useParams();

    console.log(
        mergeUserUI(DEFAULT_USER_UI, {
            preferences: {
                ...DEFAULT_USER_UI.preferences,
                overlay: true,
            },
            styles: {
                dark: {
                    colors: {},
                    body: {},
                },
                light: {
                    colors: {},
                },
                typography: {},
            },
        }),
    );

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
        <Block id="user-favorites">
            <Header
                to={
                    !extended
                        ? '/u/' + params.username + '/favorites'
                        : undefined
                }
            >
                <HeaderContainer className="overflow-hidden">
                    <HeaderTitle variant={extended ? 'h2' : 'h3'}>
                        Улюблені
                    </HeaderTitle>
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
