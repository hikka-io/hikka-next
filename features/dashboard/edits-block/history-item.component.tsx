import format from 'date-fns/format';
import Link from 'next/link';
import { FC } from 'react';

import { cn } from '@/utils/utils';

interface Props {
    data: Hikka.ModerationLog;
    className?: string;
}

const HistoryItem: FC<Props> = ({ data, className }) => {
    return (
        <div className={cn('flex gap-2 hover:no-underline', className)}>
            <div className="flex size-6 items-center justify-center rounded-sm bg-secondary/60 p-1">
                {data.icon}
            </div>
            <div className="flex w-full flex-col">
                <div className="flex flex-1 items-center justify-between">
                    <h5 className="font-display text-sm font-medium leading-6">
                        <Link href={`/u/${data.username}`}>
                            {data.username}
                        </Link>
                    </h5>
                    <h5 className="text-xs font-medium text-muted-foreground">
                        {format(data.created * 1000, 'd MMMM HH:mm')}
                    </h5>
                </div>
                <h5 className="text-sm font-medium text-muted-foreground">
                    {data.title}{' '}
                    <Link className="inline-block" href={data.href}>
                        <h5 className="font-semibold text-white">
                            {data.href_text}
                        </h5>
                    </Link>{' '}
                    {data.after_text}
                </h5>
            </div>
        </div>
    );
};

export default HistoryItem;
