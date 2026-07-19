import { type FC, useState } from 'react';

import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CONTENT_CONFIG } from '@/utils/constants/common';
import { useParams } from '@/utils/navigation';

import Ost from './components/ost';
import Video from './components/video';

type Props = {
    extended?: boolean;
};

const Media: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { data: anime } = CONTENT_CONFIG.anime.useInfo(String(params.slug));
    const [active, setActive] = useState<'video' | 'music'>('video');

    if (!anime || (anime.ost.length === 0 && anime.videos.length === 0)) {
        return null;
    }

    const hasVideo = anime.videos.length > 0;
    const hasMusic = anime.ost.length > 0;

    const effectiveActive =
        active === 'video' && !hasVideo
            ? 'music'
            : active === 'music' && !hasMusic
              ? 'video'
              : active;

    return (
        <Block id="content-media">
            <Header
                href={!extended ? `/anime/${params.slug}/media` : undefined}
            >
                <HeaderContainer>
                    <HeaderTitle>Медіа</HeaderTitle>
                    <Tabs
                        value={effectiveActive}
                        onValueChange={(value) =>
                            setActive(value as 'video' | 'music')
                        }
                    >
                        <TabsList size="sm">
                            {anime.videos.length > 0 && (
                                <TabsTrigger value="video" aria-label="Відео">
                                    Відео
                                </TabsTrigger>
                            )}
                            {anime.ost.length > 0 && (
                                <TabsTrigger value="music" aria-label="Музика">
                                    Музика
                                </TabsTrigger>
                            )}
                        </TabsList>
                    </Tabs>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>

            {effectiveActive === 'video' && (
                <Video videos={anime.videos} extended={extended} />
            )}
            {effectiveActive === 'music' && (
                <Ost ost={anime.ost} extended={extended} />
            )}
        </Block>
    );
};

export default Media;
