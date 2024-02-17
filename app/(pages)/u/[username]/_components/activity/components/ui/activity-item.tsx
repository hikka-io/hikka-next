import { formatDistance } from 'date-fns';
import * as React from 'react';
import { Fragment } from 'react';
import MaterialSymbolsShieldRounded from '~icons/material-symbols/shield-rounded';
import MaterialSymbolsInfoRounded from '~icons/material-symbols/info-rounded'
import Link from 'next/link';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import BaseCard from '@/components/ui/base-card';
import { Label } from '@/components/ui/label';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { cn } from '@/utils';
import { convertActivity } from '@/utils/convertActivity';

interface Props {
    data: Hikka.History;
    className?: string;
}

const Component = ({ data, className }: Props) => {
    const { titleLanguage } = useSettingsContext();

    const activity = convertActivity(data);

    return (
        <div className={cn('flex gap-4 items-center', className)}>
            <div className="w-12">
                {data.content ? (
                    <BaseCard
                        href={`/anime/${data.content.slug}`}
                        poster={data.content.poster}
                    />
                ) : (
                    <Avatar className="rounded-md w-12 h-12">
                        <AvatarFallback className="rounded-md">
                            <MaterialSymbolsInfoRounded className="text-xl flex-1 text-muted-foreground" />
                        </AvatarFallback>
                    </Avatar>
                )}
            </div>
            <div className="flex flex-col gap-2 flex-1">
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
                <p className="text-xs leading-normal text-muted-foreground">
                    {activity.map((event, i, arr) =>
                        event ? (
                            <Fragment key={i}>
                                {event}
                                {i !== arr.length - 1 && ', '}
                            </Fragment>
                        ) : null,
                    )}
                </p>
                <p className="text-xs text-muted-foreground opacity-60">
                    {formatDistance(data.created * 1000, Date.now(), {
                        addSuffix: true,
                    })}
                </p>
            </div>
        </div>
    );
};

export default Component;
