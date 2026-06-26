import type { FC } from 'react';

import type { AnimeOstResponse } from '@hikka/api';

import ContentCard from '@/components/content-card/content-card';
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
                <ContentCard
                    target="_blank"
                    key={(ost.spotify || ost.title || '') + index}
                    href={ost.spotify || undefined}
                    title={ost.title}
                    containerRatio={1}
                    description={
                        // TODO(phase2): drop cast — ost_type is plain string in @hikka/api, OST keyed by old enum
                        OST[ost.ost_type as keyof typeof OST].title_ua ||
                        OST[ost.ost_type as keyof typeof OST].title_en
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
