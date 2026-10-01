import { type FC, memo } from 'react';

import type { HistoryResponse } from '@hikka/api';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import MaterialSymbolsInfoRounded from '@/components/icons/material-symbols/MaterialSymbolsInfoRounded';
import RelativeTime from '@/components/relative-time';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTitle } from '@/services/session';
import { CONTENT_TYPE_LINKS } from '@/utils/content-paths';
import { Link } from '@/utils/navigation';

import { convertHistory } from './convert-history';
import HistoryFacts from './history-facts';

type Props = {
    data: HistoryResponse;
    className?: string;
    withUser?: boolean;
};

const User: FC<Props> = memo(({ data }) => (
    <Tooltip>
        <TooltipTrigger render={<Link to={`/u/${data.user.username}`} />}>
            <Avatar className="size-10 rounded-md">
                <AvatarImage
                    className="size-10 rounded-md"
                    src={data.user.avatar}
                />
                <AvatarFallback
                    className="size-10 rounded-md"
                    title={data.user.username?.[0]}
                />
            </Avatar>
        </TooltipTrigger>
        <TooltipContent>{data.user.username}</TooltipContent>
    </Tooltip>
));

const HistoryItem: FC<Props> = (props) => {
    const { data, withUser, className } = props;
    const title = useTitle(data.content);

    const { facts } = convertHistory(data);

    return (
        <HorizontalCard className={className}>
            <HorizontalCardImage
                image={
                    data.content?.data_type === 'anime'
                        ? data.content?.image
                        : data.content?.image || (
                              <MaterialSymbolsInfoRounded className="flex-1 text-muted-foreground text-xl" />
                          )
                }
                to={
                    data.content
                        ? `${CONTENT_TYPE_LINKS[data.content.data_type as keyof typeof CONTENT_TYPE_LINKS]}/${data.content.slug}`
                        : undefined
                }
            />
            <HorizontalCardContainer>
                <HorizontalCardTitle
                    to={
                        data.content
                            ? `${CONTENT_TYPE_LINKS[data.content.data_type as keyof typeof CONTENT_TYPE_LINKS]}/${data.content.slug}`
                            : '#'
                    }
                >
                    {title || 'Загальне'}
                </HorizontalCardTitle>
                <HistoryFacts facts={facts} />
                <RelativeTime value={data.created} className="opacity-60" />
            </HorizontalCardContainer>
            {withUser && <User {...props} />}
        </HorizontalCard>
    );
};

export default HistoryItem;
