import { type FC, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { animeSlugOptions } from '@hikka/api';

import MaterialSymbolsLibraryMusicRounded from '@/components/icons/material-symbols/MaterialSymbolsLibraryMusicRounded';
import Block from '@/components/ui/block';
import EmptyState from '@/components/ui/empty-state';
import { Header, HeaderTitle } from '@/components/ui/header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams } from '@/utils/navigation';

import Ost from './components/ost';
import Video from './components/video';

type Props = {
    extended?: boolean;
};

const ContentMedia: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { data: anime } = useQuery(
        animeSlugOptions({ path: { slug: String(params.slug) } }),
    );
    const [active, setActive] = useState<'video' | 'music'>('video');

    if (!anime) {
        return null;
    }

    if (anime.ost.length === 0 && anime.videos.length === 0) {
        return extended ? (
            <EmptyState
                bordered
                icon={<MaterialSymbolsLibraryMusicRounded />}
                title="Медіа не знайдено"
                description="Інформацію ще не додано"
            />
        ) : null;
    }

    const hasVideo = anime.videos.length > 0;
    const hasMusic = anime.ost.length > 0;
    const hasTabs = hasVideo && hasMusic;

    const effectiveActive =
        active === 'video' && !hasVideo
            ? 'music'
            : active === 'music' && !hasMusic
              ? 'video'
              : active;

    return (
        <Block id="content-media">
            {(!extended || hasTabs) && (
                <Header>
                    {!extended && (
                        <HeaderTitle to={`/anime/${params.slug}/media`}>
                            Медіа
                        </HeaderTitle>
                    )}
                    {hasTabs && (
                        <Tabs
                            value={effectiveActive}
                            onValueChange={(value) =>
                                setActive(value as 'video' | 'music')
                            }
                        >
                            <TabsList size="sm">
                                <TabsTrigger value="video" aria-label="Відео">
                                    Відео
                                </TabsTrigger>
                                <TabsTrigger value="music" aria-label="Музика">
                                    Музика
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    )}
                </Header>
            )}

            {effectiveActive === 'video' && (
                <Video videos={anime.videos} extended={extended} />
            )}
            {effectiveActive === 'music' && (
                <Ost ost={anime.ost} extended={extended} />
            )}
        </Block>
    );
};

export default ContentMedia;
