import { HistoryResponse } from '@hikka/client';
import { formatDistance } from 'date-fns/formatDistance';
import Link from 'next/link';
import { FC, memo } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { convertActivity } from '@/utils/adapters/convert-activity';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

import MaterialSymbolsInfoRounded from './icons/material-symbols/MaterialSymbolsInfoRounded';

interface Props {
    data: HistoryResponse;
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
            className={className}
            href={
                data.content
                    ? `${CONTENT_TYPE_LINKS[data.content.data_type]}/${data.content.slug}`
                    : '#'
            }
        >
            <HorizontalCardImage
                image={
                    data.content?.data_type === 'anime'
                        ? data.content?.image
                        : data.content?.image || (
                              <MaterialSymbolsInfoRounded className="flex-1 text-xl text-muted-foreground" />
                          )
                }
            />
            <HorizontalCardContainer>
                <HorizontalCardTitle>
                    {data.content?.title || 'Загальне'}
                </HorizontalCardTitle>
                <HorizontalCardDescription
                    className="line-clamp-2"
                    href={
                        data.content
                            ? `${CONTENT_TYPE_LINKS[data.content!.data_type]}/${data.content!.slug}`
                            : undefined
                    }
                >
                    {activity.join(', ')}
                </HorizontalCardDescription>
                <HorizontalCardDescription className="opacity-60">
                    {formatDistance(data.created * 1000, Date.now(), {
                        addSuffix: true,
                    })}
                </HorizontalCardDescription>
            </HorizontalCardContainer>
            {withUser && <User {...props} />}
        </HorizontalCard>
    );
};

export default HistoryItem;
