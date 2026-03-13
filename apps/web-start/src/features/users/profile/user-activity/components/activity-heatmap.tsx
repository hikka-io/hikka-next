'use client';

import { useUserActivity } from '@hikka/react';
import { format } from 'date-fns';
import { FC, useEffect, useMemo, useRef, useState } from 'react';

import { useParams } from '@/utils/navigation';

import HeatmapCell from './heatmap-cell';

const DAYS_IN_YEAR = 365;
const DAYS_IN_WEEK = 7;
const CELL_SIZE = 10; // size-2.5 = 10px
const CELL_GAP = 4; // gap-0.5 = 2px

function computeLevel(
    actions: number,
    thresholds: number[],
): 0 | 1 | 2 | 3 | 4 {
    if (actions === 0) return 0;
    if (actions <= thresholds[0]) return 1;
    if (actions <= thresholds[1]) return 2;
    if (actions <= thresholds[2]) return 3;
    return 4;
}

const ActivityHeatmap: FC = () => {
    const params = useParams();
    const containerRef = useRef<HTMLDivElement>(null);
    const [visibleWeeks, setVisibleWeeks] = useState<number>(0);

    const { data } = useUserActivity({
        username: String(params.username),
        options: {
            enabled: !!params.username,
        },
    });

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const measure = () => {
            const width = el.clientWidth;
            setVisibleWeeks(
                Math.floor((width + CELL_GAP) / (CELL_SIZE + CELL_GAP)),
            );
        };

        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const { grid, thresholds } = useMemo(() => {
        const activityMap = new Map<string, number>();

        if (data) {
            for (const item of data) {
                if (!item.timestamp || item.actions === 0) continue;
                const date = new Date(item.timestamp * 1000);
                const key = format(date, 'yyyy-MM-dd');
                activityMap.set(
                    key,
                    (activityMap.get(key) || 0) + item.actions,
                );
            }
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const days: { date: Date; actions: number }[] = [];
        for (let i = DAYS_IN_YEAR - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const key = format(date, 'yyyy-MM-dd');
            days.push({ date, actions: activityMap.get(key) || 0 });
        }

        const nonZero = days
            .map((d) => d.actions)
            .filter((a) => a > 0)
            .sort((a, b) => a - b);

        let thresholds: number[];
        if (nonZero.length === 0) {
            thresholds = [1, 2, 3];
        } else {
            thresholds = [
                nonZero[Math.floor(nonZero.length * 0.25)] || 1,
                nonZero[Math.floor(nonZero.length * 0.5)] || 2,
                nonZero[Math.floor(nonZero.length * 0.75)] || 3,
            ];
        }

        const startDayOfWeek = (days[0].date.getDay() + 6) % 7;
        const paddedDays: ((typeof days)[number] | null)[] = [
            ...Array.from({ length: startDayOfWeek }, () => null),
            ...days,
        ];

        const weeks: ((typeof days)[number] | null)[][] = [];
        for (let i = 0; i < paddedDays.length; i += DAYS_IN_WEEK) {
            weeks.push(paddedDays.slice(i, i + DAYS_IN_WEEK));
        }

        return { grid: weeks, thresholds };
    }, [data]);

    const displayGrid = visibleWeeks > 0 ? grid.slice(-visibleWeeks) : grid;

    return (
        <div className="flex flex-col gap-4">
            <div ref={containerRef} className="overflow-hidden">
                <div className="flex justify-end gap-1">
                    {displayGrid.map((week, weekIdx) => (
                        <div key={weekIdx} className="flex flex-col gap-1">
                            {week.map((day, dayIdx) =>
                                day ? (
                                    <HeatmapCell
                                        key={dayIdx}
                                        date={day.date}
                                        actions={day.actions}
                                        level={computeLevel(
                                            day.actions,
                                            thresholds,
                                        )}
                                    />
                                ) : (
                                    <div
                                        key={dayIdx}
                                        className="size-2.5"
                                    />
                                ),
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>Менше</span>
                {[0, 1, 2, 3, 4].map((level) => (
                    <div
                        key={level}
                        className={
                            level === 0
                                ? 'size-2.5 rounded-xs bg-secondary'
                                : level === 1
                                  ? 'size-2.5 rounded-xs bg-primary-foreground/20'
                                  : level === 2
                                    ? 'size-2.5 rounded-xs bg-primary-foreground/40'
                                    : level === 3
                                      ? 'size-2.5 rounded-xs bg-primary-foreground/70'
                                      : 'size-2.5 rounded-xs bg-primary-foreground'
                        }
                    />
                ))}
                <span>Більше</span>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
