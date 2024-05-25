'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

import MDViewer from '@/components/markdown/viewer/MD-viewer';
import TextExpand from '@/components/text-expand';
import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import useCharacterInfo from '@/services/hooks/characters/use-character-info';

const Description = () => {
    const [active, setActive] = useState<'description_ua'>('description_ua');
    const params = useParams();
    const { data: character } = useCharacterInfo({ slug: String(params.slug) });

    if (!character || !character.description_ua) {
        return null;
    }

    return (
        <Block>
            <Header title="Опис">
                <ToggleGroup
                    type="single"
                    value={active}
                    onValueChange={(value: 'description_ua') =>
                        value && setActive(value)
                    }
                    variant="outline"
                    size="badge"
                >
                    {character.description_ua && (
                        <ToggleGroupItem
                            value="description_ua"
                            aria-label="Назва українскою"
                        >
                            UA
                        </ToggleGroupItem>
                    )}
                </ToggleGroup>
            </Header>
            <TextExpand>
                <MDViewer>
                    {character[active] || character.description_ua}
                </MDViewer>
            </TextExpand>
        </Block>
    );
};

export default Description;
