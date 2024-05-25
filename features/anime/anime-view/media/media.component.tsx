'use client';

import { useParams } from 'next/navigation';
import { FC, useState } from 'react';

import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import useAnimeInfo from '@/services/hooks/anime/useAnimeInfo';

import Ost from './ost';
import Video from './video';

interface Props {
    extended?: boolean;
}

const Media: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { data: anime } = useAnimeInfo({ slug: String(params.slug) });
    const [active, setActive] = useState<'video' | 'music'>(
        anime?.videos && anime.videos.length === 0 ? 'music' : 'video',
    );

    if (!anime || (anime.ost.length === 0 && anime.videos.length === 0)) {
        return null;
    }

    return (
        <Block>
            <Header
                title="Медіа"
                href={!extended ? params.slug + '/media' : undefined}
            >
                <ToggleGroup
                    type="single"
                    value={active}
                    onValueChange={(value: 'video' | 'music') =>
                        value && setActive(value)
                    }
                    variant="outline"
                    size="badge"
                >
                    {anime.videos.length > 0 && (
                        <ToggleGroupItem value="video" aria-label="Відео">
                            Відео
                        </ToggleGroupItem>
                    )}
                    {anime.ost.length > 0 && (
                        <ToggleGroupItem value="music" aria-label="Музика">
                            Музика
                        </ToggleGroupItem>
                    )}
                </ToggleGroup>
            </Header>
            {active === 'video' && (
                <Video videos={anime.videos} extended={extended} />
            )}
            {active === 'music' && <Ost ost={anime.ost} extended={extended} />}
        </Block>
    );
};

export default Media;
