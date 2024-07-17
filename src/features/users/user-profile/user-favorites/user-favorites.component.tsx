'use client';

import { useParams } from 'next/navigation';
import { FC, useState } from 'react';

import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
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
    const [content, setContent] = useState<API.ContentType>('anime');
    const params = useParams();

    const getComponent = () => {
        switch (content) {
            case 'anime':
                return <Anime extended={extended} />;
            case 'character':
                return <Character extended={extended} />;
            case 'manga':
                return <Manga extended={extended} />;
            case 'novel':
                return <Novel extended={extended} />;
            case 'collection':
                return <Collections extended={extended} />;
            default:
                return null;
        }
    };

    return (
        <Block>
            <Header
                title="Улюблені"
                href={
                    !extended
                        ? '/u/' + params.username + '/favorites'
                        : undefined
                }
            >
                <ToggleGroup
                    type="single"
                    value={content}
                    onValueChange={(value: API.ContentType) =>
                        value && setContent(value)
                    }
                    variant="outline"
                    size="badge"
                >
                    <ToggleGroupItem value="anime" aria-label="Улюблені аніме">
                        Аніме
                    </ToggleGroupItem>
                    <ToggleGroupItem value="manga" aria-label="Улюблена манґа">
                        Манґа
                    </ToggleGroupItem>
                    <ToggleGroupItem value="novel" aria-label="Улюблене ранобе">
                        Ранобе
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="character"
                        aria-label="Улюблені персонажі"
                    >
                        Персонажі
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="collection"
                        aria-label="Улюблені колекції"
                    >
                        Колекції
                    </ToggleGroupItem>
                </ToggleGroup>
            </Header>
            {getComponent()}
        </Block>
    );
};

export default Favorites;
