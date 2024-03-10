'use client';

import { useState } from 'react';

import { useParams } from 'next/navigation';

import SubHeader from '@/components/sub-header';
import { Button } from '@/components/ui/button';

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
                <Button
                    variant={content === 'anime' ? 'secondary' : 'outline'}
                    size="badge"
                    onClick={() => setContent('anime')}
                >
                    Аніме
                </Button>
                <Button
                    variant={content === 'character' ? 'secondary' : 'outline'}
                    size="badge"
                    onClick={() => setContent('character')}
                >
                    Персонажі
                </Button>
                <Button
                    variant={content === 'collection' ? 'secondary' : 'outline'}
                    size="badge"
                    onClick={() => setContent('collection')}
                >
                    Колекції
                </Button>
            </SubHeader>
            {getComponent()}
        </div>
    );
};

export default Component;
