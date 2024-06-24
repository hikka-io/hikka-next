import Link from 'next/link';
import { FC, memo } from 'react';
import MaterialSymbolsInfoRounded from '~icons/material-symbols/info-rounded';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import HorizontalCard from '@/components/ui/horizontal-card';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { convertActivity } from '@/utils/convert-activity';

interface Props {
    data: API.History;
    className?: string;
    withUser?: boolean;
}

const User: FC<Props> = memo(({ data }) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <Link href={`/u/${data.user.username}`}>
                <Avatar className="size-10 rounded-md">
                    <AvatarImage
                        className="size-10 rounded-md"
                        src={data.user.avatar}
                    />
                    <AvatarFallback
                        className="size-10 rounded-md"
                        title={data.user.username[0]}
                    />
                </Avatar>
            </Link>
        </TooltipTrigger>
        <TooltipContent>{data.user.username}</TooltipContent>
    </Tooltip>
));

const HistoryItem: FC<Props> = (props) => {
    const { data, withUser, className } = props;

    const activity = convertActivity(data);

    return (
        <HorizontalCard
            title={data.content?.title || 'Загальне'}
            href={data.content ? `/anime/${data.content.slug}` : '#'}
            description={activity.join(', ')}
            descriptionClassName="line-clamp-2"
            descriptionHref={data.content && `/anime/${data.content.slug}`}
            createdAt={data.created}
            image={
                data.content?.data_type === 'anime'
                    ? data.content?.poster
                    : data.content?.image || (
                          <MaterialSymbolsInfoRounded className="flex-1 text-xl text-muted-foreground" />
                      )
            }
            className={className}
        >
            {withUser && <User {...props} />}
        </HorizontalCard>
    );
};

export default HistoryItem;
