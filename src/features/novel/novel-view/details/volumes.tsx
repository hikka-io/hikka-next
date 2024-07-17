import { FC } from 'react';

import { Label } from '@/components/ui/label';

interface Props {
    volumes: number;
}

const Volumes: FC<Props> = ({ volumes }) => {
    if (!volumes) {
        return null;
    }

    return (
        <div className="flex flex-wrap">
            <div className="w-24">
                <Label className="text-muted-foreground">Томи:</Label>
            </div>
            <div className="flex-1">
                <Label>{volumes}</Label>
            </div>
        </div>
    );
};

export default Volumes;
