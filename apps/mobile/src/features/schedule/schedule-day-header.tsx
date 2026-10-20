import type { FC } from 'react';

import { Badge } from '@/components/ui/badge';
import { Header, HeaderTitle } from '@/components/ui/header';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
    weekday?: string;
    date?: string;
};

const ScheduleDayHeader: FC<Props> = ({ weekday, date }) => (
    <Header className="bg-background px-4 pt-4 pb-2">
        {weekday ? (
            <>
                <HeaderTitle size="section">{weekday}</HeaderTitle>
                <Badge>{date}</Badge>
            </>
        ) : (
            <>
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-6 w-24" />
            </>
        )}
    </Header>
);

export default ScheduleDayHeader;
