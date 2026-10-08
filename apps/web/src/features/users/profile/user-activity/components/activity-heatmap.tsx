import { type FC, type PointerEvent, useMemo, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

import { serviceUserActivityOptions } from '@hikka/api';

import { Tooltip, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';
import { getDeclensionWord, type WordForms } from '@/utils/i18n/declension';
import { APP_LOCALE_TAG } from '@/utils/i18n/locale';
import { DAY_FORMS } from '@/utils/i18n/word-forms';
import { useParams } from '@/utils/navigation';

import { type ActivityDay, buildActivityGrid } from './activity-grid';

const ACTION_FORMS = ['дія', 'дії', 'дій'] as const satisfies WordForms;

const LEVEL_CLASSES = [
    'bg-secondary',
    'bg-[color-mix(in_oklab,var(--primary-foreground)_25%,var(--secondary))]',
    'bg-[color-mix(in_oklab,var(--primary-foreground)_50%,var(--secondary))]',
    'bg-[color-mix(in_oklab,var(--primary-foreground)_75%,var(--secondary))]',
    'bg-primary-foreground',
] as const;

const formatCount = (count: number, forms: WordForms) =>
    `${count.toLocaleString(APP_LOCALE_TAG)} ${getDeclensionWord(count, forms)}`;

type ActiveCell = {
    anchor: HTMLElement;
    day: ActivityDay;
};

const ActivityHeatmap: FC = () => {
    const params = useParams();
    const gridRef = useRef<HTMLDivElement>(null);
    const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);
    const [open, setOpen] = useState(false);

    const { data, isError } = useQuery(
        serviceUserActivityOptions({
            path: { username: String(params.username) },
        }),
    );

    const { weeks, total, activeDays } = useMemo(
        () => buildActivityGrid(data),
        [data],
    );

    if (isError && !data) {
        return (
            <p className="text-muted-foreground text-sm">
                Не вдалося завантажити активність
            </p>
        );
    }

    const label =
        total > 0
            ? `Активність: ${formatCount(total, ACTION_FORMS)} за рік, ${formatCount(activeDays, DAY_FORMS)} з активністю`
            : 'Немає активності за рік';

    const showCell = (target: EventTarget) => {
        if (!(target instanceof HTMLElement)) return;

        const { week, weekday } = target.dataset;
        const day = weeks[Number(week)]?.[Number(weekday)];
        if (!day) return;

        setActiveCell({ anchor: target, day });
        setOpen(true);
    };

    const handlePointerOver = (event: PointerEvent) => {
        if (event.pointerType !== 'touch') showCell(event.target);
    };

    const handlePointerUp = (event: PointerEvent) => {
        if (event.pointerType === 'touch') showCell(event.target);
    };

    const handlePointerLeave = (event: PointerEvent) => {
        if (event.pointerType !== 'touch') setOpen(false);
    };

    return (
        <div className="flex flex-col gap-3">
            {/* A lone child of a row-reverse scroller opens scrolled to the newest week;
                the width rounds down to whole 14px week columns so none is cut. */}
            <div className="-my-1 -mr-1 flex w-[calc(round(down,100%_+_4px,14px)_+_4px)] flex-row-reverse self-end overflow-x-auto pb-1">
                <div
                    ref={gridRef}
                    role="img"
                    aria-label={label}
                    className="flex gap-1 p-1"
                    onPointerOver={handlePointerOver}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerLeave}
                >
                    {weeks.map((week, weekIndex) => (
                        <div
                            key={weekIndex}
                            className="flex shrink-0 flex-col gap-1"
                        >
                            {week.map((day, weekday) => (
                                <div
                                    key={weekday}
                                    data-week={weekIndex}
                                    data-weekday={weekday}
                                    className={cn(
                                        'size-2.5 rounded-xs',
                                        day && 'cursor-pointer',
                                        day && LEVEL_CLASSES[day.level],
                                        open &&
                                            day &&
                                            activeCell?.day === day &&
                                            'outline-2 outline-foreground outline-offset-1',
                                    )}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <span>Менше</span>
                {LEVEL_CLASSES.map((levelClass) => (
                    <div
                        key={levelClass}
                        className={cn('size-2.5 rounded-xs', levelClass)}
                    />
                ))}
                <span>Більше</span>
            </div>
            <Tooltip
                open={open}
                onOpenChange={(nextOpen, { reason, event }) => {
                    if (nextOpen) return;
                    if (
                        reason === 'outside-press' &&
                        event.target instanceof Node &&
                        gridRef.current?.contains(event.target)
                    ) {
                        return;
                    }
                    setOpen(false);
                }}
            >
                <TooltipContent anchor={activeCell?.anchor}>
                    {activeCell && (
                        <>
                            <span className="font-medium">
                                {activeCell.day.actions > 0
                                    ? formatCount(
                                          activeCell.day.actions,
                                          ACTION_FORMS,
                                      )
                                    : 'Немає активності'}
                            </span>
                            <span className="text-tooltip-foreground/70">
                                {' · '}
                                {format(
                                    activeCell.day.date,
                                    'EEEEEE, d MMMM yyyy',
                                )}
                            </span>
                        </>
                    )}
                </TooltipContent>
            </Tooltip>
        </div>
    );
};

export default ActivityHeatmap;
