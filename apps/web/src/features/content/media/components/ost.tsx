import type { FC } from 'react';

import type { AnimeOstResponse } from '@hikka/api';

import PosterCard from '@/components/content-card/poster-card';
import MaterialSymbolsLibraryMusicRounded from '@/components/icons/material-symbols/MaterialSymbolsLibraryMusicRounded';
import Stack from '@/components/ui/stack';
import { OST } from '@/utils/constants/common';

type Props = {
    extended?: boolean;
    ost: AnimeOstResponse[];
};

const Ost: FC<Props> = ({ extended, ost }) => {
    if (!ost) {
        return null;
    }

    const filteredOSTData = extended ? ost : ost.slice(0, 4);

    return (
        <Stack size={5} extended={extended}>
            {filteredOSTData.map((ost, index) => (
                <PosterCard
                    target="_blank"
                    key={(ost.spotify || ost.title || '') + index}
                    href={ost.spotify || undefined}
                    title={ost.title}
                    containerRatio={1}
                    description={
                        OST[ost.ost_type].title_ua || OST[ost.ost_type].title_en
                    }
                    image={
                        <MaterialSymbolsLibraryMusicRounded className="text-4xl text-muted-foreground" />
                    }
                />
            ))}
        </Stack>
    );
};

export default Ost;
