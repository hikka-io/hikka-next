import type { FC } from 'react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import { RELEASE_STATUS } from '@/utils/labels';

type Props = {
    status: string;
};

const ReleaseStatusBadge: FC<Props> = ({ status }) => (
    <Badge
        variant="status"
        className={cn(
            `bg-${status} text-${status}-foreground border-${status}-border`,
        )}
    >
        {RELEASE_STATUS[status as keyof typeof RELEASE_STATUS]?.title_ua}
    </Badge>
);

export default ReleaseStatusBadge;
