import { FC } from 'react';

import ContentCard from '../../../../components/content-card/content-card';
import MaterialSymbolsLibraryMusicRounded from '../../../../components/icons/material-symbols/MaterialSymbolsLibraryMusicRounded';
import Stack from '../../../../components/ui/stack';
import { OST } from '../../../../utils/constants/common';

interface Props {
    extended?: boolean;
    ost: API.OST[];
}

const Ost: FC<Props> = ({ extended, ost }) => {
    if (!ost) {
        return null;
    }

    const filteredOSTData = extended ? ost : ost.slice(0, 4);

    return (
        <Stack size={4} extended={extended}>
            {filteredOSTData.map((ost) => (
                <ContentCard
                    target="_blank"
                    key={ost.spotify}
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
