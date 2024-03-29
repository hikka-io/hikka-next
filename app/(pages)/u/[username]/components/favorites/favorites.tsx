'use client';

import { useState } from 'react';

import { useParams } from 'next/navigation';

import SubHeader from '@/components/sub-header';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import Anime from './_components/anime';
import Character from './_components/characters';
import Collections from './_components/collections';

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const [content, setContent] = useState<API.ContentType>('anime');
    const params = useParams();

    const getComponent = () => {
        switch (content) {
            case 'anime':
                return <Anime extended={extended} />;
            case 'character':
                return <Character extended={extended} />;
            case 'collection':
                return <Collections extended={extended} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <SubHeader
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
                        setContent(value)
                    }
                    variant="outline"
                    size="badge"
                >
                    <ToggleGroupItem value="anime" aria-label="Улюблені аніме">
                        Аніме
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
            </SubHeader>
            {getComponent()}
        </div>
    );
};

export default Component;
