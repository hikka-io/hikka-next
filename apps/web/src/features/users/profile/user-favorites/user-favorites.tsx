import { type FC, useRef, useState } from 'react';

import { ContentTypeEnum, type FavouriteContentTypeEnum } from '@hikka/api';

import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useScrollGradientMask } from '@/services/hooks/use-scroll-position';
import { cn } from '@/utils/cn';
import { useParams } from '@/utils/navigation';

import Anime from './components/favorite-anime';
import Character from './components/favorite-characters';
import Collections from './components/favorite-collections';
import Manga from './components/favorite-manga';
import Novel from './components/favorite-novel';

type Props = {
    extended?: boolean;
};

const Favorites: FC<Props> = ({ extended }) => {
    const [content, setContent] = useState<FavouriteContentTypeEnum>(
        ContentTypeEnum.ANIME,
    );
    const params = useParams();
    const scrollRef = useRef<HTMLDivElement>(null);
    const { gradientClassName } = useScrollGradientMask(
        scrollRef,
        'horizontal',
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
                to={!extended ? `/u/${params.username}/favorites` : undefined}
            >
                <HeaderContainer className="overflow-hidden">
                    <HeaderTitle variant={extended ? 'h2' : 'h3'}>
                        Улюблені
                    </HeaderTitle>
                    <div
                        ref={scrollRef}
                        className={cn(
                            'no-scrollbar min-w-0 flex-1 overflow-x-auto',
                            gradientClassName,
                        )}
                    >
                        <Tabs
                            value={content}
                            onValueChange={(value) =>
                                setContent(value as FavouriteContentTypeEnum)
                            }
                            className="w-max"
                        >
                            <TabsList size="sm">
                                <TabsTrigger
                                    value={ContentTypeEnum.ANIME}
                                    aria-label="Улюблені аніме"
                                >
                                    Аніме
                                </TabsTrigger>
                                <TabsTrigger
                                    value={ContentTypeEnum.MANGA}
                                    aria-label="Улюблена манґа"
                                >
                                    Манґа
                                </TabsTrigger>
                                <TabsTrigger
                                    value={ContentTypeEnum.NOVEL}
                                    aria-label="Улюблене ранобе"
                                >
                                    Ранобе
                                </TabsTrigger>
                                <TabsTrigger
                                    value={ContentTypeEnum.CHARACTER}
                                    aria-label="Улюблені персонажі"
                                >
                                    Персонажі
                                </TabsTrigger>
                                <TabsTrigger
                                    value={ContentTypeEnum.COLLECTION}
                                    aria-label="Улюблені колекції"
                                >
                                    Колекції
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            {getComponent()}
        </Block>
    );
};

export default Favorites;
