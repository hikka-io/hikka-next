import type { FC } from 'react';

import { useHydrated } from '@tanstack/react-router';

import type { HistoryResponse } from '@hikka/api';

import { cn } from '@/utils/cn';

import { groupHistoryByDay } from './history-dates';
import HistoryDayHeading from './history-day-heading';
import HistoryItem from './history-item';
import { HISTORY_VARIANTS, type HistoryVariant } from './history-variants';

// SSR cannot know the viewer's time zone; render the audience's zone until hydration so markup matches.
const SERVER_TIME_ZONE = 'Europe/Kyiv';

type Props = {
    items: HistoryResponse[];
    variant: HistoryVariant;
    withUser?: boolean;
    className?: string;
};

const HistoryTimeline: FC<Props> = ({
    items,
    variant,
    withUser,
    className,
}) => {
    const hydrated = useHydrated();
    const timeZone = hydrated ? undefined : SERVER_TIME_ZONE;
    const config = HISTORY_VARIANTS[variant];
    const days = groupHistoryByDay(items, Date.now(), timeZone);

    return (
        <div className={cn('flex flex-col', config.days, className)}>
            {days.map((day) => (
                <section key={day.key}>
                    <HistoryDayHeading
                        label={day.label}
                        detail={day.detail}
                        large={config.largeHeading}
                    />
                    <div className={cn('flex flex-col', config.rows)}>
                        {day.items.map((item) => (
                            <HistoryItem
                                key={item.reference}
                                data={item}
                                posterClassName={config.poster}
                                mainFactOnly={config.mainFactOnly}
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
