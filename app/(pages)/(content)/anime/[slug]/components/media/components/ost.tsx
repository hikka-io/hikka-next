import { FC } from 'react';
import IcBaselineLibraryMusic from '~icons/ic/baseline-library-music';

import EntryCard from '@/components/entry-card/entry-card';
import Stack from '@/components/ui/stack';
import { OST } from '@/utils/constants';

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
                <EntryCard
                    target="_blank"
                    key={ost.spotify}
                    href={ost.spotify || undefined}
                    title={ost.title}
                    containerRatio={1}
                    description={
                        OST[ost.ost_type].title_ua || OST[ost.ost_type].title_en
                    }
                    poster={
                        <IcBaselineLibraryMusic className="text-4xl text-muted-foreground" />
                    }
                />
            ))}
        </Stack>
    );
};

export default Ost;
