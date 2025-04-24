import { AnimeStatusEnum } from '@hikka/client';
import { FC } from 'react';

import { Label } from '@/components/ui/label';

interface Props {
    status: AnimeStatusEnum | null;
    episodes_total: number | null;
    episodes_released: number | null;
}

const Episodes: FC<Props> = ({ status, episodes_released, episodes_total }) => {
    if (!(episodes_total || episodes_released)) {
        return null;
    }

    return (
        <div className="flex flex-wrap">
            <div className="w-24">
                <Label className="text-muted-foreground">Епізоди:</Label>
            </div>
            <div className="flex-1">
                <Label>
                    {status === 'finished'
                        ? episodes_total || '?'
                        : `${episodes_released || '?'} / ${episodes_total || '?'}`}
                </Label>
            </div>
        </div>
    );
};

export default Episodes;
