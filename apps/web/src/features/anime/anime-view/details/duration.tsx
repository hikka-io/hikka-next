import { formatDuration } from 'date-fns/formatDuration';
import { intervalToDuration } from 'date-fns/intervalToDuration';
import { FC } from 'react';

import { Label } from '@/components/ui/label';

interface Props {
    duration: number;
}

const Duration: FC<Props> = ({ duration }) => {
    if (!duration) {
        return null;
    }

    return (
        <div className="flex flex-wrap">
            <div className="w-24">
                <Label className="text-muted-foreground">
                    Тривалість епізоду:
                </Label>
            </div>
            <div className="flex-1">
                <Label>
                    {formatDuration(
                        intervalToDuration({
                            start: 0,
                            end: duration * 60 * 1000,
                        }),
                    )}
                </Label>
            </div>
        </div>
    );
};

export default Duration;
