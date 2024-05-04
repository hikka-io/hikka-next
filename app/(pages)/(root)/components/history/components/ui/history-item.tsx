import * as React from 'react';
import { FC, Fragment } from 'react';

import HorizontalCard from '@/components/ui/horizontal-card';
import { convertActivity } from '@/utils/convertActivity';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';

interface Props {
    data: API.History;
    className?: string;
}

const HistoryItem: FC<Props> = ({ data, className }) => {
    const activity = convertActivity(data);

    if (activity.length === 0) {
        return null;
    }

    if (!data.content) return null;

    const Activity = (
        <Fragment>
            {activity.map((event, i, arr) =>
                event ? (
                    <Fragment key={i}>
                        {event}
                        {i !== arr.length - 1 && ', '}
                    </Fragment>
                ) : null,
            )}
        </Fragment>
    );

    return (
        <HorizontalCard
            title={data.content.title!}
            href={`/anime/${data.content.slug}`}
            description={Activity}
            createdAt={data.created}
            image={data.content.poster}
        >
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href={`/u/${data.user.username}`}>
                        <Avatar className="size-10 rounded-md">
                            <AvatarImage className="size-10 rounded-md" src={data.user.avatar} />
                            <AvatarFallback className="size-10 rounded-md" title={data.user.username[0]} />
                        </Avatar>
                    </Link>
                </TooltipTrigger>
                <TooltipContent>
                    {data.user.username}
                </TooltipContent>
            </Tooltip>
        </HorizontalCard>
    );
};

export default HistoryItem;
