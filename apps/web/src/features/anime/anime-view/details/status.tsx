import { AnimeStatusEnum } from '@hikka/client';
import { FC } from 'react';

import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

import { RELEASE_STATUS } from '@/utils/constants/common';
import { cn } from '@/utils/utils';

interface Props {
    status: AnimeStatusEnum | null;
}

const Status: FC<Props> = ({ status }) => {
    if (!status) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center">
            <div className="w-24">
                <Label className="text-muted-foreground">Статус:</Label>
            </div>
            <div className="flex-1">
                <Badge
                    variant="status"
                    className={cn(
                        `bg-${status} text-${status}-foreground border-${status}-border`,
                    )}
                >
                    {RELEASE_STATUS[status].title_ua}
                </Badge>
            </div>
        </div>
    );
};

export default Status;
