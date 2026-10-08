import type { FC } from 'react';

import { useHydrated } from '@tanstack/react-router';

import type { HistoryResponse } from '@hikka/api';

import { cn } from '@/utils/cn';

import { groupHistoryByDay } from './history-dates';
import HistoryDayHeading from './history-day-heading';
import HistoryItem from './history-item';
import { type HistorySize, historyRowsVariants } from './history-row';

// SSR cannot know the viewer's time zone; render the audience's zone until hydration so markup matches.
const SERVER_TIME_ZONE = 'Europe/Kyiv';

type Props = {
    items: HistoryResponse[];
    size?: HistorySize;
    withUser?: boolean;
    className?: string;
};

const HistoryTimeline: FC<Props> = ({
    items,
    size = 'default',
    withUser,
    className,
}) => {
    const hydrated = useHydrated();
    const timeZone = hydrated ? undefined : SERVER_TIME_ZONE;
    const days = groupHistoryByDay(items, Date.now(), timeZone);

    return (
        <div
            className={cn(
                'flex flex-col',
                size === 'lg' ? 'gap-10' : 'gap-6',
                className,
            )}
        >
            {days.map((day) => (
                <section key={day.key}>
                    <HistoryDayHeading
                        label={day.label}
                        detail={day.detail}
                        size={size}
                    />
                    <div className={historyRowsVariants({ size })}>
                        {day.items.map((item) => (
                            <HistoryItem
                                key={item.reference}
                                data={item}
                                size={size}
                                withUser={withUser}
                                timeZone={timeZone}
                            />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
};

export default HistoryTimeline;
