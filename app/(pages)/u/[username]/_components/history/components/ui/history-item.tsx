import { formatDistance } from 'date-fns';
import * as React from 'react';
import { Fragment } from 'react';
import MaterialSymbolsInfoRounded from '~icons/material-symbols/info-rounded';

import Link from 'next/link';

import Small from '@/components/typography/small';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import BaseCard from '@/components/ui/base-card';
import { Label } from '@/components/ui/label';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { cn } from '@/utils';
import { convertActivity } from '@/utils/convertActivity';

interface Props {
    data: API.History;
    className?: string;
}

const Component = ({ data, className }: Props) => {
    const { titleLanguage } = useSettingsContext();

    const activity = convertActivity(data);

    if (activity.length === 0) {
        return null;
    }

    return (
        <div className={cn('flex gap-4', className)}>
            <div className="w-12">
                {data.content ? (
                    <BaseCard
                        href={`/anime/${data.content.slug}`}
                        poster={data.content.poster}
                    />
                ) : (
                    <Avatar className="size-12 rounded-md">
                        <AvatarFallback className="rounded-md">
                            <MaterialSymbolsInfoRounded className="flex-1 text-xl text-muted-foreground" />
                        </AvatarFallback>
                    </Avatar>
                )}
            </div>
            <div className="flex flex-1 flex-col gap-2">
                <Label asChild={Boolean(data.content)} className="line-clamp-1">
                    {data.content ? (
                        <Link href={`/anime/${data.content.slug}`}>
                            {data.content[titleLanguage!] ||
                                data.content.title_ua ||
                                data.content.title_en ||
                                data.content.title_ja}
                        </Link>
                    ) : (
                        'Загальне'
                    )}
                </Label>
                <Small className="leading-normal text-muted-foreground">
                    {activity.map((event, i, arr) =>
                        event ? (
                            <Fragment key={i}>
                                {event}
                                {i !== arr.length - 1 && ', '}
                            </Fragment>
                        ) : null,
                    )}
                </Small>
                <Small className="text-muted-foreground opacity-60">
                    {formatDistance(data.updated * 1000, Date.now(), {
                        addSuffix: true,
                    })}
                </Small>
            </div>
        </div>
    );
};

export default Component;
