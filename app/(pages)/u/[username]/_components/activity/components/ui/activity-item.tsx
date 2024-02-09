import { formatDistance } from 'date-fns';

import Link from 'next/link';

import BaseCard from '@/components/ui/base-card';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils';
import { createFavoriteEvents } from '@/utils/convertFavoriteActivity';
import { createWatchEvents } from '@/utils/convertWatchActivity';

interface Props {
    data: Hikka.History;
    className?: string;
}

const Component = ({ data, className }: Props) => {
    if (!data.content) return null;

    const createEvent = data.history_type.includes('watch')
        ? createWatchEvents
        : createFavoriteEvents;

    return (
        <div className={cn('flex gap-4 items-center', className)}>
            <div className="w-12">
                <BaseCard
                    href={`/anime/${data.content.slug}`}
                    poster={data.content.poster}
                />
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <Label asChild className="line-clamp-1">
                    <Link href={`/anime/${data.content.slug}`}>
                        {data.content.title_ua}
                    </Link>
                </Label>
                <p className="text-xs leading-normal text-muted-foreground">
                    {createEvent(data.history_type, data.data).map(
                        (event, i, arr) =>
                            event ? (
                                <>
                                    {event}
                                    {i !== arr.length - 1 && ', '}
                                </>
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