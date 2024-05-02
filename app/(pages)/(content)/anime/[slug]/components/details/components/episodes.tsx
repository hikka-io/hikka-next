import { FC } from 'react';

import { Label } from '@/components/ui/label';

interface Props {
    status: API.Status;
    episodes_total: number;
    episodes_released: number;
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
