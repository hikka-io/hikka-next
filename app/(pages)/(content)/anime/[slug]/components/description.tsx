'use client';

import { useState } from 'react';

import { useParams } from 'next/navigation';

import MDViewer from '@/components/markdown/viewer/MD-viewer';
import TextExpand from '@/components/text-expand';
import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import useAnimeInfo from '@/services/hooks/anime/useAnimeInfo';

const Description = () => {
    const [active, setActive] = useState<'synopsis_ua' | 'synopsis_en'>(
        'synopsis_ua',
    );
    const params = useParams();
    const { data } = useAnimeInfo({ slug: String(params.slug) });

    if (!data || (!data.synopsis_ua && !data.synopsis_en)) {
        return null;
    }

    return (
        <Block>
            <Header title="Опис">
                <ToggleGroup
                    type="single"
                    value={active}
                    onValueChange={(value: 'synopsis_ua' | 'synopsis_en') =>
                        value && setActive(value)
                    }
                    variant="outline"
                    size="badge"
                >
                    {data.synopsis_ua && (
                        <ToggleGroupItem
                            value="synopsis_ua"
                            aria-label="Опис українскою"
                        >
                            UA
                        </ToggleGroupItem>
                    )}
                    {data.synopsis_en && (
                        <ToggleGroupItem
                            value="synopsis_en"
                            aria-label="Опис англійською"
                        >
                            EN
                        </ToggleGroupItem>
                    )}
                </ToggleGroup>
            </Header>
            <TextExpand>
                <MDViewer>
                    {data[active] || data.synopsis_ua || data.synopsis_en}
                </MDViewer>
            </TextExpand>
        </Block>
    );
};

export default Description;
