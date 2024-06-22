import { FC } from 'react';

import { Label } from '@/components/ui/label';

interface Props {
    chapters: number;
}

const Chapters: FC<Props> = ({ chapters }) => {
    if (!chapters) {
        return null;
    }

    return (
        <div className="flex flex-wrap">
            <div className="w-24">
                <Label className="text-muted-foreground">Розділи:</Label>
            </div>
            <div className="flex-1">
                <Label>{chapters}</Label>
            </div>
        </div>
    );
};

export default Chapters;
